//////////////////////////////////////////////////////////////////////
//////////       Driver Function Bitwise Operations         //////////
//////////////////////////////////////////////////////////////////////

// Bit Mask
const AC_MASK           = 0b10000000;
const SWITCH_MASK       = 0b01000000;
const SYNC_MASK         = 0b00100000;
const SENSOR_EXIST_MASK = 0b00010000;
const BATTERY_MASK      = 0b00001111;

const FUNC_TEST_START_BATTERY_MASK = 0b11110000;
const FUNC_TEST_ENDED_BATTERY_MASK = 0b00001111;

const PWM_MASK          = 0b11110000;
const PWM_MODE_MASK     = 0b00001111;

const SENSOR_MODE_MASK  = 0b10000000;
const HOLDTIME_MASK     = 0b00001111;

// Driver Status Options
const AC_ABSENT     = 0b00000000;
const AC_ON         = 0b10000000;

const SWITCH_OFF    = 0b00000000;
const SWITCH_ON     = 0b01000000;

const SYNC_NORMAL   = 0b00000000;
const SYNC_PROGRESS = 0b00100000;

const SENSOR_NO     = 0b00000000;
const SENSOR_YES    = 0b00010000;

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

const BRIGHTNESS_0   = 0;
const BRIGHTNESS_10  = 1;
const BRIGHTNESS_20  = 2;
const BRIGHTNESS_30  = 3;
const BRIGHTNESS_40  = 4;
const BRIGHTNESS_50  = 5;
const BRIGHTNESS_60  = 6;
const BRIGHTNESS_70  = 7;
const BRIGHTNESS_80  = 8;
const BRIGHTNESS_90  = 9;
const BRIGHTNESS_100 = 10;

// const BRIGHTNESS_0   = 0;
// const BRIGHTNESS_10  = 1;
// const BRIGHTNESS_20  = 3;
// const BRIGHTNESS_30  = 4;
// const BRIGHTNESS_40  = 6;
// const BRIGHTNESS_50  = 7;
// const BRIGHTNESS_60  = 9;
// const BRIGHTNESS_70  = 10;
// const BRIGHTNESS_80  = 12;
// const BRIGHTNESS_90  = 13;
// const BRIGHTNESS_100 = 15;

const MODE_STATE_OFF       = 0;
const MODE_STATE_ON        = 1;
const MODE_STATE_EMERGENCY = 2;
const MODE_STATE_FUNC_TEST = 3;
const MODE_STATE_DURA_TEST = 4;

const SENSOR_OFF = 0b00000000;
const SENSOR_ON  = 0b10000000;

const HOLDTIME_5S   = 0;
const HOLDTIME_10S  = 1;
const HOLDTIME_15S  = 2;
const HOLDTIME_20S  = 3;
const HOLDTIME_30S  = 4;
const HOLDTIME_1M   = 5;
const HOLDTIME_2M   = 6;
const HOLDTIME_3M   = 7;
const HOLDTIME_5M   = 8;
const HOLDTIME_10M  = 9;
const HOLDTIME_15M  = 10;
const HOLDTIME_20M  = 11;
const HOLDTIME_30M  = 12;
const HOLDTIME_40M  = 13;
const HOLDTIME_60M  = 14;
const HOLDTIME_120M = 15;

function convertHexStringToNum(hex_str) {
  return parseInt(hex_str, 16);
};

//////////////////////////////////////////////////////////////////////
//////////                     Status 1                     //////////
//////////////////////////////////////////////////////////////////////
function getDriverStatus_AC(light) {
  var byte = light.substring(0, 2);
  var status = convertHexStringToNum(byte);
  var x = status & AC_MASK;

  if (x == AC_ABSENT) {
    return 'Absent';
  } else if (x == AC_ON) {
    return 'ON';
  }
};

function getDriverStatus_SWITCH(light) {
  var byte = light.substring(0, 2);
  var status = convertHexStringToNum(byte);

  var x = status & SWITCH_MASK;

  if (x == SWITCH_OFF) {
    return 'OFF';
  } else if (x == SWITCH_ON) {
    return 'ON';
  }
};

function getDriverStatus_SYNC(light) {
  var byte = light.substring(0, 2);
  var status = convertHexStringToNum(byte);
  var x = status & SYNC_MASK;

  if (x == SYNC_NORMAL) {
    return 'Normal';
  } else if (x == SYNC_PROGRESS) {
    return 'Need Sync';
  }
};

function getDriverStatus_SENSOR(light) {
  var byte = light.substring(0, 2);
  var status = convertHexStringToNum(byte);

  var x = status & SENSOR_EXIST_MASK;

  if (x == SENSOR_NO) {
    return 'No Sensor Built-In';
  } else if (x == SENSOR_YES) {
    return 'With Sensor';
  }
};

function getDriverStatus_BATTERY(light) {
  var byte = light.substring(0, 2);
  var status = convertHexStringToNum(byte);

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
};

//////////////////////////////////////////////////////////////////////
//////////                     Status 2                     //////////
//////////////////////////////////////////////////////////////////////
function getDriverStatus_PWM(light) {
  var byte = light.substring(2, 4);
  var status = convertHexStringToNum(byte);

  var x = (status & PWM_MASK) >>> 4;

  switch (x) {
    case BRIGHTNESS_0:
      return '0%';
      break;

    case BRIGHTNESS_10:
      return '10%';
      break;

    case BRIGHTNESS_20:
      return '20%';
      break;

    case BRIGHTNESS_30:
      return '30%';
      break;

    case BRIGHTNESS_40:
      return '40%';
      break;

    case BRIGHTNESS_50:
      return '50%';
      break;

    case BRIGHTNESS_60:
      return '60%';
      break;

    case BRIGHTNESS_70:
      return '70%';
      break;

    case BRIGHTNESS_80:
      return '80%';
      break;

    case BRIGHTNESS_90:
      return '90%';
      break;

    case BRIGHTNESS_100:
      return '100%';
      break;
  }
};

function getDriverStatus_MODE(light) {
  var byte = light.substring(2, 4);
  var status = convertHexStringToNum(byte);

  var x = status & PWM_MODE_MASK;

  switch (x) {
    case MODE_STATE_OFF:
      return 'OFF';
      break;

    case MODE_STATE_ON:
      return 'ON';
      break;

    case MODE_STATE_EMERGENCY:
      return 'Emergency';
      break;

    case MODE_STATE_FUNC_TEST:
      return 'Functional Testing';
      break;

    case MODE_STATE_DURA_TEST:
      return 'Duration Testing';
      break;
  }
};

//////////////////////////////////////////////////////////////////////
//////////                      Sensor                      //////////
//////////////////////////////////////////////////////////////////////
function getDriverStatus_SENSOR_MODE(light) {
  var byte = light.substring(4, 6);
  var status = convertHexStringToNum(byte);

  var x = status & SENSOR_MODE_MASK;

  switch (x) {
    case SENSOR_OFF:
      return 'OFF';
      break;

    case SENSOR_ON:
      return 'ON';
      break;
  }
};

function getDriverStatus_HOLDTIME(light) {
  var byte = light.substring(4, 6);
  var status = convertHexStringToNum(byte);

  var x = status & HOLDTIME_MASK;

  switch (x) {
    case HOLDTIME_5S:
      return '5s';
      break;

    case HOLDTIME_10S:
      return '10s';
      break;

    case HOLDTIME_15S:
      return '15s';
      break;

    case HOLDTIME_20S:
      return '20s';
      break;

    case HOLDTIME_30S:
      return '30s';
      break;

    case HOLDTIME_1M:
      return '1m';
      break;

    case HOLDTIME_2M:
      return '2m';
      break;

    case HOLDTIME_3M:
      return '3m';
      break;

    case HOLDTIME_5M:
      return '5m';
      break;

    case HOLDTIME_10M:
      return '10m';
      break;

    case HOLDTIME_15M:
      return '15m';
      break;

    case HOLDTIME_20M:
      return '20m';
      break;

    case HOLDTIME_30M:
      return '30m';
      break;

    case HOLDTIME_40M:
      return '40m';
      break;

    case HOLDTIME_60M:
      return '60m';
      break;

    case HOLDTIME_120M:
      return '120m';
      break;
  }
};