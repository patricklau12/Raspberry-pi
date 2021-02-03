const Queue       = require('bull');
const redis       = require("redis");
const fs          = require('fs');
const file        = './log_queue.txt'
const Rclient     = redis.createClient();
const {REDIS_URL} = 'redis://127.0.0.1:6379';

const timestamp   = { hour12:   false,
                      year: '2-digit',  month: '2-digit',    day: '2-digit',
                      hour: '2-digit', minute: '2-digit', second: '2-digit' };

var getTimestamp = function() {
    var now = new Date();
    var msecs = ('00' + now.getMilliseconds()).slice(-3);
    return '[' + now.toLocaleString("zh-GB", timestamp) + '.' + msecs + ']';
};

function myconsolelog(msg) {
    console.log(getTimestamp() + '[QUEUE]   ' + msg);
}

Rclient.on('connect',() => {
    myconsolelog("Redis client connected");
});

module.exports = {
    io             : null,
    messageHandler : null,

    queueDict:{},
    joblist:{},

    initSOCKETIOandMONGO: function(io, messageHandler) {
        this.io             = io;
        this.messageHandler = messageHandler;
    },

    saveMessageToLog: function(logtext) {
        fs.appendFileSync(file, getTimestamp() + logtext + "\n", function(err) {
            if (err) return myconsolelog(err);
            myconsolelog(logtext + ' > log.txt');
        });
    },

    sendProcess: async function (job) {
        module.exports.joblist[job.id] = false;
        const { FuncID, MGID, SGID, EPID, SocketID, event, message, priority, ResendPolicy, resendCountdown, timeout} = job.data;
    
        myconsolelog(`Running Job for event ${job.data.event}, sending to #${job.data.EPID} in #${job.data.MGID}`);

        try {
            switch (FuncID) {
                default: {
                    {                        
                        let p1   = this.io.sockets.emit('server2mg', message);
                        let test = this.io.sockets.emit('debug_show', getTimestamp() + '[QUEUE]   ' + message);
                        myconsolelog('Send message   : ' + message);

                        let p2 = await new Promise((resolve, reject) => {
                            setTimeout(reject, timeout, "Timeout");
                            if (module.exports.joblist[job.id]) {
                                myconsolelog('Inside Task : Task #' + job.id + ' is killed, no next run');
                                return resolve;
                            }
                                
    
                            return reject;
                        });

                        if (job.finished()) {
                            return Promise.resolve();
                        }

                        return p2;
                    }
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    init: async function() {
        // module.exports.saveMessageToLog("init started");

        try {
            a_list = []
            for (let key in module.exports.queueDict){
                module.exports.queueDict[key].pause();
                module.exports.dequeueCurrent(key);
                a_list.push(module.exports.queueDict[key].empty().then(()=>{
                    module.exports.queueDict[key].clean(0,'active').then(()=>{
                    return "This Q"+key+" is cleaned.";
                    });
                }));
                
                module.exports.queueDict[key].resume();
                
            }
            result = await Promise.all(a_list).then((values)=>{
                myconsolelog(values);
                return values;
            })
            
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject('There was an unexpected error cleaning.'+err);
        }
    },

    createQueue: function(MGID, viewonly) {
        // module.exports.saveMessageToLog("create Q started"+MGID);
        newqueue = new Queue('queue_'+String(MGID),REDIS_URL,{settings:{lockDuration:200,maxStalledCount:0}});
        myconsolelog(newqueue); 
        if (!viewonly){
            newqueue.process(async job => {return module.exports.sendProcess(job)});

            newqueue.on('completed', job => {return module.exports.whenFinish(job); });
            newqueue.on('failed', job => {return module.exports.whenFail(job); });
        }

        module.exports.queueDict[MGID]=newqueue;
        return "The create"+'queue_'+String(MGID)+"is done."
    },

    removeQueue: async function(MGID) {
        // module.exports.saveMessageToLog("remove Q started"+MGID);
        module.exports.queueDict[MGID].clean(1000);
        await module.exports.queueDict[MGID].empty().then(()=>{
            module.exports.queueDict[MGID].close().then(()=>{
                console.log("This Q is closed.");
            });
        });
        
        delete module.exports.queueDict[MGID];
        
        return "The removal of "+'queue_'+String(MGID)+"is done."
    },

    enqueue: function(FuncID, MGID, SGID, EPID, SocketID, event, message, priority, ResendPolicy, resendCountdown, timeout) {
        if (!(MGID in module.exports.queueDict)){
            console.log("The queue has not created yet.");
            return {
                message: `The queue ${MGID} has not created yet.`,
            };
        }
        
        try {
            module.exports.queueDict[MGID].add({"FuncID":FuncID,
                 "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
                 "event":event, "message":message, "priority":priority,
                 "ResendPolicy":ResendPolicy, "resendCountdown":resendCountdown,"timeout":timeout, "resend":false},{priority:priority});
            
                 Rclient.sendCommand("BGSAVE",(err,res)=>{});

            console.log(`Job with datum \{${FuncID},${MGID},${SGID},${EPID}, `
            +`${SocketID}, with priority ${priority}\} has been added.`);

            // myconsolelog('Job ADDED');
            return {
                message: 'Your job has been sumbitted to the queue!',
            };
        } catch (err) {
            return{
                message: 'There was an unexpected error submitting your request.'+err,
            };
        }
    },

    processMSG: function(FuncID, MGID, SGID, EPID, SocketID, event, message, result){
        console.log(`ProcessMSG: Job with datum \{FuncID:${FuncID},SocketID:${SocketID},event:${event}, `
        +`, with message:${message} and result:${result}\} has been completed\n\n`);

        module.exports.messageHandler.processMSG(FuncID, MGID, SGID, EPID, SocketID, event, message, result);

        //#region old_handle_dequeue_result
        // async.series([
        //     function(callback) {
        //         switch(event) {
        //             case 'system_schedule_testing':
        //                 myconsolelog('system_schedule_testing: Respond recieved.');
        
        //                 var id          = message.substring(0, 8);
        //                 var test_type   = message.substring(8, 10);
        //                 var test_status = message.substring(10, 12);
        //                 var test_id     = message.substring(12, 14);
        
        //                 var now  = new Date();
        //                 var time = now.toLocaleString("en-GB", date_format) + ',' + now.toLocaleString("en-GB", time_format);
        
        //                 if (result == 'ResendCountDownZero') {
        //                     module.exports.Endpoint.findOneAndUpdate(
        //                         { dev_id: id },
        //                         { $set: {
        //                             connection: 'OFFLINE',
        //                         },
        //                         },
        //                         { new: true},
        //                         function(err, res) {
        //                             if (err) {
        //                                 myconsolelog(err);
        //                                 callback(err);
        //                             } else {
        //                                 myconsolelog(res);
        //                                 callback();
        //                             }
        //                     });
        
        //                 } else {
        //                     switch (test_type) {
        //                         case '10':
        //                             module.exports.Endpoint.findOneAndUpdate(
        //                                 { dev_id: id },
        //                                 { $set: {
        //                                         connection: 'ONLINE',
        //                                         lastupdate: time,
        //                                         dead_count: 0,
                                                
        //                                         func_id  : test_id,
        //                                         func_res : 'Testing',
        //                                         func_date: time
        //                                     },
        //                                 },
        //                                 { new: true },
        //                                 function(err, res) {
        //                                     if (err) {
        //                                         myconsolelog(err);
        //                                         callback(err);
        //                                     } else {
        //                                         myconsolelog(res);
        //                                         callback();
        //                                     }
        //                             });
        //                             break;

        //                         case '11':
        //                             module.exports.Endpoint.findOneAndUpdate(
        //                                 { dev_id: id },
        //                                 { $set: {
        //                                         connection: 'ONLINE',
        //                                         lastupdate: time,
        //                                         dead_count: 0,
                                                
        //                                         dura_id  : test_id,
        //                                         dura_res : 'Testing',
        //                                         dura_date: time
        //                                     },
        //                                 },
        //                                 { new: true },
        //                                 function(err, res) {
        //                                     if (err) {
        //                                         myconsolelog(err);
        //                                         callback(err);
        //                                     } else {
        //                                         myconsolelog(res);
        //                                         callback();
        //                                     }
        //                             });
        //                             break;

        //                         case '12':
        //                             module.exports.Endpoint.findOneAndUpdate(
        //                                 { dev_id: id },
        //                                 { $set: {
        //                                         connection: 'ONLINE',
        //                                         lastupdate: time,
        //                                         dead_count: 0,
                                                
        //                                         prod_id  : test_id,
        //                                         prod_res : 'Testing',
        //                                         prod_date: time
        //                                     },
        //                                 },
        //                                 { new: true },
        //                                 function(err, res) {
        //                                     if (err) {
        //                                         myconsolelog(err);
        //                                         callback(err);
        //                                     } else {
        //                                         myconsolelog(res);
        //                                         callback();
        //                                     }
        //                             });
        //                             break;

        //                         default:
        //                             callback();
        //                             break;
        //                     }
        //                 }
        //                 break;
        
        //             case 'system_get_status':
        //                 myconsolelog('system_get_status: Respond recieved.');
        
        //                 var id      = message.substring(0, 8);
        //                 var payload = message.substring(8, message.length);
        //                 var light   = payload.substring(0, 6);

        //                 if (SGID == id) {
        //                     // Sub-Gateway
        //                     if (result == 'ResendCountDownZero') {
        //                         module.exports.SubGateway.findOneAndUpdate(
        //                             { dev_id: id },
        //                             { $set: {
        //                                     connection: 'OFFLINE'
        //                                 }
        //                             },
        //                             { new: true },
        //                             function(err, res) {
        //                                 if (err) {
        //                                     myconsolelog(err);
        //                                     callback(err);
        //                                 } else {
        //                                     myconsolelog(res);
        //                                     callback();
        //                                 }
        //                             }
        //                         );
        //                     } else {
        //                         var coor = false;
        //                         if (payload.substring(6, 8) == '01') { coor = true; }
                    
        //                         module.exports.SubGateway.findOneAndUpdate(
        //                             { dev_id: id },
        //                             { $set: {
        //                                     connection   : 'ONLINE',
        //                                     dead_count   : 0,
        //                                     lastupdate   : getTestTime(),
        //                                     frequency    : payload.substring(0, 2),
        //                                     coordinator  : coor,
        //                                     repeat_sg_num: MESSAGE.convertHexStringToNum(payload.substring(2, 4)),
        //                                     repeat_ep_num: MESSAGE.convertHexStringToNum(payload.substring(4, 6)),
        //                                 }
        //                             },
        //                             { new: true },
        //                             function(err, res) {
        //                                 if (err) {
        //                                     myconsolelog(err);
        //                                     callback(err);
        //                                 } else {
        //                                     myconsolelog(res);
        //                                     callback();
        //                                 }
        //                             }
        //                         );
        //                     }

        //                 } else {
        //                     // Endpoint
        //                     if (result == 'ResendCountDownZero') {
        //                         module.exports.Endpoint.findOneAndUpdate(
        //                             { dev_id: id },
        //                             { $set: {
        //                                     connection: 'OFFLINE',
        //                                 }
        //                             },
        //                             { new: true },
        //                             function(err, res) {
        //                                 if (err) {
        //                                     myconsolelog(err);
        //                                     callback(err);
        //                                 } else {
        //                                     myconsolelog(res);
        //                                     callback(err);
        //                                 }
        //                         });
            
        //                     } else {
        //                         var connect = 'ONLINE';
            
        //                         if (light == 'eeeeee') {
        //                             connect = 'DRIVER NO RESPONSE';
            
        //                         } else if (light == 'ffffff') {
        //                             connect = 'LAMP NO RESPONSE';
            
        //                         } else {
        //                             connect = 'ONLINE';
        //                         }
            
        //                         /*
        //                          * typedef struct {	
        //                          *   uint8_t DriverStatus; 		    // AC/DC, Manual On/Off, NeedSync, wSensor/woSensor, last 4 bit Battery stat: 
        //                          *   uint8_t DriverStatus_2;		// LSB 4 bit mode state, MSB four bit: Current PWM duty
        //                          *   uint8_t Prox_Sensor;			// bit7 en/disen senor, bit6 Force enter normal dimming, bit 5 force enter EnSave, bit 4-0 sesnor hold time
        //                          *   uint8_t LastFuncTestResult;
        //                          *   uint8_t LastFuncTestID;
        //                          *   uint8_t LastDurTestResult;
        //                          *   uint8_t LastDurTestID;
        //                          *   uint8_t DurTestRemainingTimeMSB;
        //                          *   uint8_t DurTestRemainingTimeLSB;
        //                          *   uint8_t FuncTestRemainingTime;
        //                          * };
        //                          */
            
        //                         var func_res = DRIVER.getLastFuncTestResult(payload.substring(6, 8));
        //                         var dura_res = DRIVER.getLastDuraTestResult(payload.substring(10, 12));
        //                         var prod_res = DRIVER.getLastFuncTestResult(payload.substring(20, 22));
            
        //                         var func_remaining = 'Testing: ' + DRIVER.getFunctionalTestTime(payload.substring(18, 20)) + ' second(s) left';
        //                         var dura_remaining = 'Testing: ' + DRIVER.getDurationalTestTime(payload.substring(14, 16), payload.substring(16, 18)) + ' second(s) left';
            
        //                         if (func_res == 'Testing') { func_res = func_remaining; }
                                
        //                         if (dura_res == 'Testing') { dura_res = dura_remaining; }
            
        //                         if (DRIVER.getDriverStatus_BATTERY(light) == 'Unplugged') {
        //                             func_res = 'N/A: Battery Unplugged';
        //                             dura_res = 'N/A: Battery Unplugged';
        //                             prod_res = 'N/A: Battery Unplugged';
        //                         }
            
        //                         module.exports.Endpoint.findOneAndUpdate(
        //                             { dev_id: id },
        //                             { $set: {
        //                                 connection: connect,
        //                                 lastupdate: getTestTime(),
        //                                 dead_count: 0,
        //                                 light     : light,
        //                                 func_res  : func_res,
        //                                 dura_res  : dura_res,
        //                                 prod_res  : prod_res
        //                                 }
        //                             },
        //                             { new: true },
        //                             function(err, ep) {
        //                                 if (err) {
        //                                     myconsolelog(err);
        //                                     callback(err);

        //                                 } else {
        //                                     var functional_test = ep.func_date + ' ' + ep.func_res;
        //                                     var durational_test = ep.dura_date + ' ' + ep.dura_res;
        //                                     var blink_test      = ep.prod_date + ' ' + ep.prod_res;
            
        //                                     module.exports.io.sockets.emit('server2client_EP_update', ep.dev_id, ep.connection, ep.light, functional_test, durational_test, blink_test);
        //                                     myconsolelog('server2client_EP_update: Update EP #' + ep.dev_id);
        //                                     myconsolelog(ep);
        //                                     callback();
        //                                 }
        //                             }
        //                         );
        //                     }
        //                 }
        //                 break;
                    
        //             case 'system_instant_dimming':
        //                 myconsolelog('system_instant_dimming: Respond recieved.');

        //                 var id      = message.substring(0, 8);

        //                 if (result == 'ResendCountDownZero') {
        //                     module.exports.Endpoint.findOneAndUpdate(
        //                         { dev_id: id },
        //                         { $set: {
        //                                 connection: 'OFFLINE',
        //                             }
        //                         },
        //                         { new: true },
        //                         function(err, res) {
        //                             if (err) {
        //                                 myconsolelog(err);
        //                                 callback(err);
        //                             } else {
        //                                 myconsolelog(res);
        //                                 callback(err);
        //                             }
        //                     });
        
        //                 } else {        
        //                     module.exports.Endpoint.findOneAndUpdate(
        //                         { dev_id: id },
        //                         { $set: {
        //                                 connection: 'ONLINE',
        //                                 lastupdate: getTestTime(),
        //                                 dead_count: 0,
        //                             }
        //                         },
        //                         { new: true },
        //                         function(err, ep) {
        //                             if (err) {
        //                                 myconsolelog(err);
        //                                 callback(err);

        //                             } else {
        //                                 myconsolelog('system_instant_dimming: Update EP #' + ep.dev_id);
        //                                 callback();
        //                             }
        //                         }
        //                     );
        //                 }
        //         }
        //     }
        // ], function(err) {
        //     if (err) {
        //         myconsolelog(err);
        //     }
        // });
        //#endregion
    },

    dequeue: function(thisFuncID, thisMGID, thisSGID, thisEPID, DequeuePolicy, thisContent) {
        try {
            if (DequeuePolicy=="Front"||DequeuePolicy=="All"){
            module.exports.queueDict[thisMGID].pause();
            myconsolelog("Remove this " + thisFuncID + ", " + thisMGID + ", " + thisSGID + ", " + thisEPID);
            module.exports.queueDict[thisMGID].getJobs('active').then(function(value){
                value.forEach(function (element){
                    if (element.data.FuncID==thisFuncID &&
                        element.data.MGID==thisMGID &&
                        element.data.SGID==thisSGID &&
                        element.data.EPID==thisEPID){
                            myconsolelog("Current Job find, move to finish this");
                            module.exports.joblist[element.id] = true;

                            const { FuncID, MGID, SGID, EPID, SocketID, event, message, priority, ResendPolicy, resendCountdown, timeout
                                ,resend} = element.data;
                            
                            element.update({"FuncID":FuncID,
                            "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
                            "event":event, "message":message, "priority":priority,
                            "ResendPolicy":ResendPolicy, "resendCountdown":0, "timeout":timeout, "resend":true});
                            
                            
                            a = module.exports.processMSG(element.data.FuncID, element.data.MGID, element.data.SGID, element.data.EPID, 
                                    element.data.SocketID, element.data.event,
                                    thisContent, "DeQueuedAtFront");
                            
                            element.discard();
                        }
                    })
                })
            }
            if (DequeuePolicy=="Waiting"||DequeuePolicy=="All"){
                module.exports.queueDict[thisMGID].getJobs('waiting').then(function(value){
                    value.forEach((element)=>{
                        if (element.data.FuncID==thisFuncID &&
                            element.data.MGID==thisMGID &&
                            element.data.SGID==thisSGID &&
                            element.data.EPID==thisEPID){
                                myconsolelog(`Job find ${thisFuncID},${thisMGID},${thisSGID},${thisEPID},, move to finish this`);

                                a = module.exports.processMSG(element.data.FuncID, element.data.MGID, element.data.SGID, element.data.EPID, 
                                        element.data.SocketID, element.data.event,
                                        "","DeQueuedAtMiddle");
                                element.remove();
                                
                            }
                    })
                })
            }
            module.exports.queueDict[thisMGID].resume();
            return {
                message: 'Removal done!',
            };
        } catch (err) {
            return {
                message: 'There was an unexpected error removing your request.'+err,
            };
        }
    },

    dequeueCurrent: function(thisMGID){
        module.exports.queueDict[thisMGID].pause();
        module.exports.queueDict[thisMGID].getJobs('active').then(function(value){
            value.forEach(async function (element){
                    {
                        myconsolelog("Current Job find, move to finish this");
                        module.exports.joblist[element.id] = true;

                        const { FuncID, MGID, SGID, EPID, SocketID, event, message, priority, ResendPolicy, resendCountdown, timeout
                            ,resend} = element.data;
                        
                        await element.update({"FuncID":FuncID,
                        "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
                        "event":event, "message":message, "priority":priority,
                        "ResendPolicy":ResendPolicy, "resendCountdown":0, "timeout":timeout, "resend":true});
                        
                        
                        a = module.exports.processMSG(element.data.FuncID, element.data.MGID, element.data.SGID, element.data.EPID, 
                                element.data.SocketID, element.data.event,
                                 "",  "DeQueuedAtFront");
                    }
                })
            });
        module.exports.queueDict[thisMGID].resume();
        return {
            message: 'Removal done!',
        };
    },

    displayqueue: function() {
        number = []

        for (let key in module.exports.queueDict){
            module.exports.queueDict[key].getJobCounts().then((good,bad)=>{
                console.log(good);
            })
            module.exports.queueDict[key].getJobs("active").then(function(value){
                value.forEach((element=>{
                    if (element.data)
                    console.log(`FRONT: Job with datum \{${element.data.FuncID},${element.data.MGID},${element.data.SGID},${element.data.EPID}, `
                +`${element.data.SocketID}, with priority ${element.data.priority}\}, trial countdown ${element.data.resendCountdown} and timeout ${element.data.timeout}`);
                }));

            });
            module.exports.queueDict[key].getJobs("waiting").then(function(value){
                value.forEach((element=>{
                    if (element.data)
                    console.log(`Waiting: Job with datum \{${element.data.FuncID},${element.data.MGID},${element.data.SGID},${element.data.EPID}, `
                +`${element.data.SocketID}, with priority ${element.data.priority}\}, trial countdown ${element.data.resendCountdown} and timeout ${element.data.timeout}`);
                }));                
            });
        }
        console.log("\r---end of report---\n\n");
        return number;
    },

    whenFinish: function(job){
        module.exports.processMSG(job.data.FuncID, job.data.MGID, job.data.SGID, job.data.EPID, 
            job.data.SocketID, job.data.event, 
            job.returnvalue.data, job.returnvalue.result);
        return;
        
    },

    whenFail: function(job){
        myconsolelog("Check this"+module.exports.joblist[job.id]);
        console.log(`Job with datum \{${job.data.FuncID},${job.data.MGID},${job.data.SGID},${job.data.EPID}, `
            +`${job.data.SocketID}, with priority ${job.data.priority}\} and timeout ${job.data.timeout} has been failed\n\n`);
        var { FuncID, MGID, SGID, EPID, SocketID, event, message, priority, ResendPolicy, resendCountdown, timeout
         ,resend} = job.data;

        if (module.exports.joblist[job.id]){
            console.log("This task is killed so no next run");
            return;
        }
        let newRT =  resendCountdown - 1;
        let newPR = priority;
        if (!resend){
            newPR = newPR - 1;
        }

        job.update({"FuncID":FuncID,
        "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
        "event":event, "message":message, "priority":priority,
        "ResendPolicy":ResendPolicy, "resendCountdown":newRT, "timeout":timeout, "resend":true});

        if (newRT > 0){
            if (ResendPolicy=="back")
            {
                try {
                    module.exports.queueDict[MGID].add({"FuncID":FuncID,
                        "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
                        "event":event, "message":message, "priority":newPR,
                        "ResendPolicy":ResendPolicy, "resendCountdown":newRT,"resend":true, "timeout":timeout},{priority:newPR});
                    
                        Rclient.sendCommand("BGSAVE",(err,res)=>{});

                    console.log(`Job with datum \{${FuncID},${MGID},${SGID},${EPID}, `
                    +`${SocketID}, with priority ${priority}\}, timeout ${timeout} and resendCountdown ${newRT} has been added at the back.`);
                
                } catch (err) {
                    console.log("ERROR: "+err);
                }
            }
            else
            {
                try {
                    module.exports.queueDict[MGID].add({"FuncID":FuncID,
                        "MGID":MGID, "SGID":SGID, "EPID":EPID, "SocketID":SocketID,
                        "event":event, "message":message, "priority":newPR,
                        "ResendPolicy":ResendPolicy, "resendCountdown":newRT,"resend":true, "timeout":timeout},{priority:newPR});
                    
                        Rclient.sendCommand("BGSAVE",(err,res)=>{});

                    console.log(`Job with datum \{${FuncID},${MGID},${SGID},${EPID}, `
                    +`${SocketID}, with priority ${priority}\}, timeout ${timeout} and resendCountdown ${newRT} has been added at the front.`);
                
                } catch (err) {
                    console.log("ERROR: "+err);
                }
            }
        }
        else{
            module.exports.processMSG(FuncID, MGID, SGID, EPID,
                SocketID, event, 
                "", "ResendCountDownZero");
        }
    }
};
  