//////////////////////////////////////////////////////////////////////
//////////    Server-Gateway Messages Decoder / Encoder     //////////
//////////////////////////////////////////////////////////////////////

const fs = require('fs');
const prea = JSON.parse(fs.readFileSync('./public/javascripts/preamble.json'));

module.exports = {
    //////////////////////////////////////////////////////////////////
    // Get separate content in a message
    getPreamble:       function(msg) { return msg.substring(0, 4); },

    getCharacteristic: function(msg) { return msg.substring(4, 6); },

    getMGID:           function(msg) { return msg.substring(6, 14); },

    getSGID:           function(msg) { return msg.substring(14, 22); },

    getDestID:         function(msg) { return msg.substring(22, 30); },

    getFunction:       function(msg) { return msg.substring(30, 32); },

    getCRCByte:        function(msg) { return msg.substring(32, 34) },

    getRSSIValue:      function(msg) { return msg.substring(34, 36) },

    getMessageNo:      function(msg) { return msg.substring(36, 38) },

    getContent:        function(msg) { return msg.substring(38); },

    getAcknowledge:    function(msg) { return msg.substring(6, 22) + msg.substring(30, 32); },

    //////////////////////////////////////////////////////////////////
    // Convert message to string or character array (hexadecimal)
    convertHexStringToNum: function(hex_str) {
        return parseInt(hex_str, 16);
    },

    convertNumToHexString: function(num) {
        var temp = num.toString(16);
        if (num <= 15) temp = '0' + num.toString(16);
        return temp;
    },

    convertStringToNum_TIME: function(str) {
        return parseInt(str, 10);
    },

    convertNumToString_TIME: function(num) {
        var temp;
        if (num <= 9) {
            temp = '0' + num.toString(10);
        } else {
            temp = num.toString(10);
        }
        
        return temp;
    },

    convertNumToString_LEVEL: function(str) {    
        switch (str) {    
            case '10':
                return '10';
                break;
        
            case '20':
                return '20';
                break;
        
            case '30':
                return '30';
                break;
        
            case '40':
                return '40';
                break;
        
            case '50':
                return '50';
                break;
        
            case '60':
                return '60';
                break;
        
            case '70':
                return '70';
                break;
        
            case '80':
                return '80';
                break;
        
            case '90':
                return '90';
                break;
        
            case '100':
                return 'a0';
                break;

            default:
                return '00';
                break;
        }
    },

    convertStringToNum_LEVEL: function(str) {    
        switch (str) {    
            case '10':
                return '10';
                break;
        
            case '20':
                return '20';
                break;
        
            case '30':
                return '30';
                break;
        
            case '40':
                return '40';
                break;
        
            case '50':
                return '50';
                break;
        
            case '60':
                return '60';
                break;
        
            case '70':
                return '70';
                break;
        
            case '80':
                return '80';
                break;
        
            case '90':
                return '90';
                break;
        
            case 'a0':
                return '100';
                break;

            default:
                return '00';
                break;
        }
    },

    convertRSSIRank: function(str) {
        var x = parseInt(str, 16);

        if (x > 110) {
            return '6 (' + x + ')';
        } else if (x > 100) {
            return '5 (' + x + ')';
        } else if (x > 90) {
            return '4 (' + x + ')';
        } else if (x > 80) {
            return '3 (' + x + ')';
        } else if (x > 70) {
            return '2 (' + x + ')';
        } else {
            return '1 (' + x + ')';
        }
    },

    //////////////////////////////////////////////////////////////////
    // Check message preamble
    checkValidMsg: function(preamble, characteristic) {
        if ((prea.hasOwnProperty(preamble)) && (characteristic.substring(0, 1) == '0')) {
            return true;
        } else {
            return false;
        }
    },

    // Create random device ID
    randomID: function() {
        var randID = '';
        for (var i = 0; i < 4; i++) {
            var num = Math.floor(Math.random() * 256);
            var temp = num.toString(16);
            if (num <= 15) temp = '0' + num.toString(16);
            randID = randID + temp;
        }
        return randID;
    },

    random00ID: function() {
        var randID = '00';
        for (var i = 1; i < 4; i++) {
            var num = Math.floor(Math.random() * 256);
            var temp = num.toString(16);
            if (num <= 15) temp = '0' + num.toString(16);
            randID = randID + temp;
        }
        return randID;
    },

    randomTestID: function() {
        var num  = Math.floor(Math.random() * 256);
        var mask = 0b01111111;

        if ((num & mask) <= 15) {
            return '0' + (num & mask).toString(16);
        } else {
            return (num & mask).toString(16);
        }
    },

    //////////////////////////////////////////////////////////////////
    // Construct message to be sent to main-gateways
    msgConstructor: function(Preamble, DeviceType, MSGType, MGID, SGID, DestID, Func, Content) {
        var int_Characteristic = this.convertHexStringToNum(MSGType) + this.convertHexStringToNum(DeviceType);
        var str_Characteristic = this.convertNumToHexString(int_Characteristic);
        return Preamble + str_Characteristic + MGID + SGID + DestID + Func + 'aa0100' + Content;
    },

    checkCRC: function(msg, crc) {
        var B = msg.match(/.{1,2}/g);
        var total = 0;
        var i = 0;
        
        for (i; i < B.length; i++) {
            total += this.convertHexStringToNum(B[i]);
        }

        var check = (total - this.convertHexStringToNum(crc)) % 16;
        
        if (check == 0) {
            return true;
        } else {
            return false;
        }
    },

    //////////////////////////////////////////////////////////////////
    // Operate Main-Gateway events
    scanSG: function(MGID, Content) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, this.random00ID(), this.randomID(), '00', Content);
    },

    lockSG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '01', '');
    },

    scanEP: function(MGID) {
        return this.msgConstructor('aaaa', '10', '02', MGID, this.randomID(), this.randomID(), '08', '');
    },

    getEP: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0a', '');
    },

    lockEP_SG: function(MGID, SGID, Content) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0b', Content);
    },

    lockEP_EP: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0d', '');
    },

    setEPslot: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '17', '');
    },

    sendHeartbeat: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0f', '');
    },

    getHeartbeat: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '11', '');
    },

    unlockEPSG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0e', '');
    },

    setEPStatus: function(MGID, SGID, EPID, TYPE, Content) {
        var sendContent = EPID + Content;
        if (TYPE == 'SG') {
            return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '21', sendContent);
        } else {
            return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '21', sendContent);
        }
    },

    getEPStatus: function(MGID, SGID, EPID, TYPE) {
        var sendContent = EPID;
        if (TYPE == 'SG') {
            return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '20', sendContent);
        } else {
            return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '20', sendContent);
        }
    },

    setEPMode: function(MGID, SGID, EPID, CONTENT) {
        var sendContent = EPID + CONTENT;
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, EPID, '22', sendContent);
    },

    changeMode: function(MGID, MODE) {
        return this.msgConstructor('aaaa', '10', '02', MGID, this.randomID(), this.randomID(), '23', MODE);
    },

    syncTime: function(MGID, TIME) {
	    var Content = '00000000' + TIME;
        return this.msgConstructor('aaaa', '10', '02', MGID, this.randomID(), this.randomID(), '26', Content);
    },

    triggerFunctionalTest: function(MGID, SGID, EPID) {
        var sendContent = EPID + '1000' + this.randomTestID();
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '28', sendContent);
    },

    triggerDurationTest: function(MGID, SGID, EPID) {
        var sendContent = EPID + '1100' + this.randomTestID();
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '28', sendContent);
    },

    triggerBlinkTest: function(MGID, SGID, EPID) {
        var sendContent = EPID + '1200' + this.randomTestID();
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '28', sendContent);
    },
    
    getLastTestResult: function(MGID, SGID, EPID) {
        var sendContent = EPID + '000000000000'
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '29', sendContent);
    },

    clearEESG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '19', '');
    },

    clearEEEP: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '1b', '');
    },

    clearEESGMemory: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '0c', '');
    },

    findPath: function(MGID, SGID, RSSI) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '03', RSSI);
    },

    addRepeatLoRaID: function(MGID, SGID, Content) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '05', Content);
    },

    pingSG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '30', '');
    },

    clearBrutally: function(MGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, this.randomID(), this.randomID(), '51', '');
    },

    setCoordinator: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '2c', '');
    },

    resetCoordinator: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '2d', '');
    },

    switchSGFrequency: function(MGID, SGID, FREQ) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '2e', FREQ);
    },

    dimmingEP: function(MGID, SGID, EPID, LEVEL) {
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '27', EPID + LEVEL);
    },

    sensorTimeEP: function(MGID, SGID, EPID, TIME) {
        return this.msgConstructor('aaaa', '20', '01', MGID, SGID, SGID, '2a', EPID + TIME);
    },
    
    //////////////////////////////////////////////////////////////////
    unlockSG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '02', '');
    },

    getRepeatLoRaID: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '06', '');
    },

    clearRepeatLoRaIDSystem: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, SGID, this.randomID(), '07', '');
    },

    clearRepeatLoRaIDNormal: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '07', '');
    },

    pingEP: function(MGID, EPID) {
        var Content = EPID + 'aaaa'
        return this.msgConstructor('aaaa', '10', '0a', MGID, this.randomID(), this.randomID(), '31', Content);
    },

    resetEP: function(MGID, EPID) {
        return this.msgConstructor('aaaa', '10', '0a', MGID, this.randomID(), this.randomID(), '1a', EPID);
    },

    restartSG: function(MGID, SGID) {
        return this.msgConstructor('aaaa', '10', '01', MGID, SGID, SGID, '2f', '');
    },
};
