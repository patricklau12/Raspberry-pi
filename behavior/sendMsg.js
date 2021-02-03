
module.exports = {
    emulateSend: async function(id, msg){
      // This function is used to send things
      randomTime = ~~(Math.random()*10);
      await new Promise(resolve => setTimeout(resolve, randomTime*1000));
      return "Data received...";
    },
    sendMsg:async function(id, msg, timeout){
        console.log("Send message"+String(msg));
        let p3 = new Promise((resolve, reject)=>{
          setTimeout(resolve, 5*1000, "ManualTimeout")
        });
        await p3;
        return ;
        let p1 = new Promise((resolve, reject)=>{
          return resolve( module.exports.emulateSend(id, msg));
        })
        let p2 = new Promise((resolve, reject)=>{
          setTimeout(resolve, timeout*1000, "Timeout")
        });
        
        return await Promise.race([p1,p2]).then((value)=>
          {
            // console.log(value);
            return module.exports.receiveMsg(id, value);
          }
          
        ).catch((reason)=>{
          console.info(reason);
          return Promise.reject(reason);
        });

        
    },
    receiveMsg(id, msg){

        chance = ~~(Math.random()*10);
        result = false;
        if (chance>0){
          console.log("Received Failed");
          // throw new Error("Received Failed ERROR.");
          return Promise.reject({id:id, result:result, data:"NOTHING"});
        }
        else{
          console.log("Received Success");
          result = true;
          return Promise.resolve({id:id, result:result, data:msg});
        }
        console.log("Receive Msg action Done\n");
        
    }
};