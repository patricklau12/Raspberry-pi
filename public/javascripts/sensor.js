socket.on('sensor_demo', function(dest, warning) {
  console.log(dest + ': ' + warning);

  if (dest == '10000970') {
    var id = 'water';
  
    if (warning == '02') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000971') {
    var id = 'door';
  
    if (warning == '02') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000972') {
    var id = 'toilet';
  
    if (warning == '01') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000973') {
    var id = 'queue';

    switch(warning) {
      case '00':
        document.getElementById(id).src = 'images/Sensor-State/queue_0.png';
        break;
      
      case '01':
        document.getElementById(id).src = 'images/Sensor-State/queue_1.png';
        break;
      
      case '02':
        document.getElementById(id).src = 'images/Sensor-State/queue_2.png';
        break;
      
      case '03':
        document.getElementById(id).src = 'images/Sensor-State/queue_3.png';
        break;
    }

  } else if (dest == '10000974') {
    var id = 'paper';

    switch(warning) {
      case '00':
        document.getElementById(id).src = 'images/Sensor-State/paper_0.png';
        break;
      
      case '01':
        document.getElementById(id).src = 'images/Sensor-State/paper_1.png';
        break;
      
      case '02':
        document.getElementById(id).src = 'images/Sensor-State/paper_2.png';
        break;
    }

  } else if (dest == '10000975') {
    var id = 'tissue';

    switch(warning) {
      case '00':
        document.getElementById(id).src = 'images/Sensor-State/tissue_0.png';
        break;
      
      case '01':
        document.getElementById(id).src = 'images/Sensor-State/tissue_1.png';
        break;
      
      case '02':
        document.getElementById(id).src = 'images/Sensor-State/tissue_2.png';
        break;
    }

  } else if (dest == '10000976') {
    var id = 'soap';

    if (warning == '01') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000977') {
    var id = 'bin';

    switch(warning) {
      case '00':
        document.getElementById(id).src = 'images/Sensor-State/bin_0.png';
        break;
      
      case '01':
        document.getElementById(id).src = 'images/Sensor-State/bin_1.png';
        break;
      
      case '02':
        document.getElementById(id).src = 'images/Sensor-State/bin_2.png';
        break;
    }

  } else if (dest == '10000978') {
    var id = 'urinal';

    if (warning == '01') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000979') {
    var id = 'air';
    var PM25_MSB = parseInt(warning.substring(0,2), 16) * 256;
    var PM25_LSB = parseInt(warning.substring(2,4), 16);
    var PM25     = PM25_MSB + PM25_LSB;
    
    var PM10_MSB = parseInt(warning.substring(4,6), 16) * 256;
    var PM10_LSB = parseInt(warning.substring(6,8), 16);
    var PM10     = PM10_MSB + PM10_LSB;
    
    var H2S_MSB  = parseInt(warning.substring(8,10), 16) * 256;
    var H2S_LSB  = parseInt(warning.substring(10,12), 16);
    var H2S      = H2S_MSB + H2S_LSB;
    
    var NH3_MSB  = parseInt(warning.substring(12,14), 16) * 256;
    var NH3_LSB  = parseInt(warning.substring(14,16), 16);
    var NH3      = NH3_MSB + NH3_LSB;
    
    var CO2_MSB  = parseInt(warning.substring(16,18), 16) * 256;
    var CO2_LSB  = parseInt(warning.substring(18,20), 16);
    var CO2      = CO2_MSB + CO2_LSB;

    var CH2O_MSB = parseInt(warning.substring(20,22), 16) * 256;
    var CH2O_LSB = parseInt(warning.substring(22,24), 16);
    var CH2O     = CH2O_MSB + CH2O_LSB;

    var TVOC_MSB = parseInt(warning.substring(24,26), 16) * 256;
    var TVOC_LSB = parseInt(warning.substring(26,28), 16);
    var TVOC     = TVOC_MSB + TVOC_LSB;

    var TEMP     = parseInt(warning.substring(28,30), 16);
    var HUMD     = parseInt(warning.substring(30,32), 16);

    var content = "<pre>" +
                  "PM2.5       : " + PM25 + " &mu;g/m<sup>3</sup><br>" +
                  "PM10        : " + PM10 + " &mu;g/m<sup>3</sup><br>" +
                  "H2S         : " + H2S  + " ppm<br>" +
                  "NH3         : " + NH3  + " ppm<br>" +
                  "CO2         : " + CO2  + " ppm<br>" +
                  "CH2O        : " + CH2O + " ppm<br>" +
                  "TVOC        : " + TVOC + " ppb<br>" +
                  "Temperature : " + TEMP + " &#8451;<br>" +
                  "Humidity    : " + HUMD + " %<br>" +
                  "</pre>";

    $('#aqi').text(content);

  } else if (dest == '10000980') {
    var id = 'smoke2';

    if (warning == '01') {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'False.png';

    } else {
      document.getElementById(id).src = 'images/Sensor-State/' + id + 'True.png';
    }

  } else if (dest == '10000981') {
    var id      = 'water2';
    
    $('#water_time').text( 'Last Update: ' + warning);
  }
});