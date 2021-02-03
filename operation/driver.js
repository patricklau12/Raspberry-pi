//////////////////////////////////////////////////////////////////////
//////////       Driver Function Bitwise Operations         //////////
//////////////////////////////////////////////////////////////////////

// Bit Mask
const FUNC_TEST_ID_MASK = 0b10000000;

const FUNC_TEST_START_BATTERY_MASK = 0b11110000;
const FUNC_TEST_ENDED_BATTERY_MASK = 0b00001111;

const DURA_TEST_BATTERY_MASK       = 0b00001111;
const BATTERY_MASK                 = 0b00001111;

const BATTERY_0             = 0;
const BATTERY_10            = 1;
const BATTERY_20            = 2;
const BATTERY_30            = 3;
const BATTERY_40            = 4;
const BATTERY_50            = 5;
const BATTERY_60            = 6;
const BATTERY_70            = 7;
const BATTERY_80            = 8;
const BATTERY_90            = 9;
const BATTERY_100           = 10;
const BATTERY_UNPLUGGED     = 11;
const BATTERY_FAILURE       = 12;
const BATTERY_NON_EMERGENCY = 15;

module.exports = {
  convertHexStringToNum: function(hex_str) {
    return parseInt(hex_str, 16);
  },

  //////////////////////////////////////////////////////////////////////
  //////////                      Battery                     //////////
  //////////////////////////////////////////////////////////////////////
  getDriverStatus_BATTERY: function(light) {
    var byte = light.substring(0, 2);
    var status = this.convertHexStringToNum(byte);
  
    var x = status & BATTERY_MASK;
  
    switch (x) {
      case BATTERY_0:
        return '0%';
        break;
  
      case BATTERY_10:
        return '10%';
        break;
  
      case BATTERY_20:
        return '20%';
        break;
  
      case BATTERY_30:
        return '30%';
        break;
  
      case BATTERY_40:
        return '40%';
        break;
  
      case BATTERY_50:
        return '50%';
        break;
  
      case BATTERY_60:
        return '60%';
        break;
  
      case BATTERY_70:
        return '70%';
        break;
  
      case BATTERY_80:
        return '80%';
        break;
  
      case BATTERY_90:
        return '90%';
        break;
  
      case BATTERY_100:
        return '100%';
        break;
  
      case BATTERY_UNPLUGGED:
        return 'Unplugged';
        break;
      
      case BATTERY_FAILURE:
        return 'Failure';
        break;
  
      case BATTERY_NON_EMERGENCY:
        return 'Non-Emergency';
        break;
    }
  },

  //////////////////////////////////////////////////////////////////////
  //////////                       Test                       //////////
  //////////////////////////////////////////////////////////////////////
  getLastDuraTestResult: function(msg) {
    if (msg == 'ee') {
      return 'Testing';

    } else if (msg == 'e0') {
      // FAIL: Test Terminated [AC Absent]
      return 'Test Terminated';

    } else if (msg == 'ef') {
      // FAIL: Test Terminated [Test Not Finish]
      return 'Test Failed';

    } else {
      var x = this.convertHexStringToNum(msg) & DURA_TEST_BATTERY_MASK;

      switch (x) {
        case BATTERY_0:
          return 'FAIL: Remaining battery 0%';
          break;

        case BATTERY_10:
          return 'PASS: Remaining battery 10%';
          break;

        case BATTERY_20:
          return 'PASS: Remaining battery 20%';
          break;

        case BATTERY_30:
          return 'PASS: Remaining battery 30%';
          break;

        case BATTERY_40:
          return 'PASS: Remaining battery 40%';
          break;

        case BATTERY_50:
          return 'PASS: Remaining battery 50%';
          break;

        case BATTERY_60:
          return 'PASS: Remaining battery 60%';
          break;

        case BATTERY_70:
          return 'PASS: Remaining battery 70%';
          break;

        case BATTERY_80:
          return 'PASS: Remaining battery 80%';
          break;

        case BATTERY_90:
          return 'PASS: Remaining battery 90%';
          break;

        case BATTERY_100:
          return 'PASS: Remaining battery 100%';
          break;

        case BATTERY_UNPLUGGED:
          return 'N/A: Battery Unplugged';
          break;
        
        case BATTERY_FAILURE:
          return 'FAIL: Battery Failure';
          break;
  
        case BATTERY_NON_EMERGENCY:
          return 'FAIL: Battery Non-Emergency Mode';
          break;
      }
    }
  },

  getLastFuncTestResult: function(msg) {
    if (msg == 'ee') {
      return 'Testing';

    } else if (msg == 'e0') {
      return 'Test Terminated';

    } else if (msg == 'ef') {
      return 'Test Failed';

    } else {
      var result = this.convertHexStringToNum(msg);
      var start  = ((result & FUNC_TEST_START_BATTERY_MASK) >> 4);
      var ended  = result & FUNC_TEST_ENDED_BATTERY_MASK;

      var x = start - ended;

      var end_display = '';
      var srt_display = '';

      switch (ended) {
        case BATTERY_0:
          end_display = '0';
          break;

        case BATTERY_10:
          end_display = '10';
          break;

        case BATTERY_20:
          end_display = '20';
          break;

        case BATTERY_30:
          end_display = '30';
          break;

        case BATTERY_40:
          end_display = '40';
          break;

        case BATTERY_50:
          end_display = '50';
          break;

        case BATTERY_60:
          end_display = '60';
          break;

        case BATTERY_70:
          end_display = '70';
          break;

        case BATTERY_80:
          end_display = '80';
          break;

        case BATTERY_90:
          end_display = '90';
          break;

        case BATTERY_100:
          end_display = '100';
          break;
      }

      switch (start) {
        case BATTERY_0:
          srt_display = '0';
          break;

        case BATTERY_10:
          srt_display = '10';
          break;

        case BATTERY_20:
          srt_display = '20';
          break;

        case BATTERY_30:
          srt_display = '30';
          break;

        case BATTERY_40:
          srt_display = '40';
          break;

        case BATTERY_50:
          srt_display = '50';
          break;

        case BATTERY_60:
          srt_display = '60';
          break;

        case BATTERY_70:
          srt_display = '70';
          break;

        case BATTERY_80:
          srt_display = '80';
          break;

        case BATTERY_90:
          srt_display = '90';
          break;

        case BATTERY_100:
          srt_display = '100';
          break;
      }

      if (x <= 2) {
        return 'PASS: Battery level ' + srt_display + '%[BEFORE] ' + end_display + '%[AFTER]';
      } else if (ended == BATTERY_UNPLUGGED) {
        return 'N/A: Battery Unplugged';
      } else if (ended == BATTERY_FAILURE) {
        return 'FAIL: Battery Failure';
      } else if (ended == BATTERY_NON_EMERGENCY) {
        return 'FAIL: Battery Non-Emergency Mode';
      } else {
        return 'FAIL: Battery level ' + srt_display + '%[BEFORE] ' + end_display + '%[AFTER]';
      }
    }
  },

  getCurrentTestState: function(msg) {
    switch (msg) {
      case '00':
        return 'Default';
      
      case '01':
        return 'Start Testing';

      case '02':
        return 'Driver No Response';

      case '03':
        return 'Functional Test in Progress';

      case '04':
        return 'Duration Test in Progress';

      case '05':
        return 'Device in Emergency Mode';

      default:
        return 'Cannot get Response';
    }
  },

  getFunctionalTestTime: function(time) {
    return this.convertHexStringToNum(time);
  },

  getDurationalTestTime: function(msb, lsb) {
    var time = this.convertHexStringToNum(msb) * 256 + this.convertHexStringToNum(lsb);
    return time;
  },

  checkFuncTestID: function(id) {
    if ((id & FUNC_TEST_ID_MASK) > 0) {
      return true;

    } else {
      return false;
    }
  },
  //////////////////////////////////////////////////////////////////////
};
