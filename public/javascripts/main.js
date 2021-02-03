var socket = io.connect();

function displayDevice(str) {
    var chop = str.match(/.{1,2}/g);
    var result = chop[0] + '.' + chop[1] + '.' + chop[2] + '.' + chop[3];
    return result.toUpperCase();
};

function getResult(result) {
    var msg = result.split(':');
    return msg[0];
};

function getDischarge(result) {
    var msg = result.split(':');
    return msg[1];
};

function getDate() {
    var date_format = { year: 'numeric', month: 'long', day: '2-digit' };
    var now = new Date();
    return now.toLocaleString("en-GB", date_format);
};

function displayWatt(str) {
    return str + 'W';
};

function displayTime(str) {
    if (parseInt(str) < 10) {
        return '0' + str;
    } else {
        return str;
    }
};

function disableButtonUltraShort() {
    $(".btnSubmit").attr("disabled", true);
    $(".btnNormal").attr("disabled", true);
  
    setTimeout(function() {
      $(".btnSubmit").attr("disabled", false);
      $(".btnNormal").attr("disabled", false);
    }, 500);
};
  
function disableButtonShort() {
    $(".btnSubmit").attr("disabled", true);
    $(".btnNormal").attr("disabled", true);

    setTimeout(function() {
        $(".btnSubmit").attr("disabled", false);
        $(".btnNormal").attr("disabled", false);
    }, 3000);
};

function disableButtonLong() {
    $(".btnSubmit").attr("disabled", true);
    $(".btnNormal").attr("disabled", true);

    setTimeout(function() {
        $(".btnSubmit").attr("disabled", false);
        $(".btnNormal").attr("disabled", false);
    }, 10000);
};