const PROPERTY     = $('#site_name').text();

var $monitor_table = $('#monitor_table');
var $device_table  = $('#devicetable');
var $floor_table   = $('#floor_table');

var bounds         = [[0,0], [720,1280]];

$('#myTab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

$(function() {
  $monitor_table.bootstrapTable();
  $device_table.bootstrapTable();
  $floor_table.bootstrapTable();

  socket.emit('client2server_admin_home', PROPERTY, '');
});

function monitor_refresh() {
  $monitor_table.bootstrapTable('removeAll');

  socket.emit('client2server_admin_home', PROPERTY, 'refresh');
};

socket.on('server2client_admin_home', function(blockList, img, refresh) {
  $('#site_img').attr("src","/uploads/" + img);

  for (i = 0; i < blockList.length; i++) {
    var maingateway = blockList[i].split('=');
    var mg_issue    = '';
    var sg_display  = '';
    var ep_display  = '';

    var btn_dimming_mode = '<div class="btn-group" role="group">'
                         + '  <button class="btn btn-primary" id="' + maingateway[0] + '" onclick="selectMode(this)"  data-toggle="tooltip" data-placement="top" title="Set Dimming Mode"><span class="fas fa-project-diagram"></span></button>'
                         + '  <select class="form-control" id="'    + maingateway[0] + 'mode">'
                         + '    <option value="0a">A</option>'
                         + '    <option value="0b">B</option>'
                         + '    <option value="0c">C</option>'
                         + '    <option value="0d">D</option>'
                         + '    <option value="0e">E</option>'
                         + '    <option value="0f">F</option>'
                         + '</div>';

    if (maingateway[7] == '1') {
      mg_issue = '<span class="fas fa-exclamation"></span>';
    } else {
      mg_issue = '<span class="fas fa-check"></span>';
    }

    sg_display = maingateway[3] + ' / ' + maingateway[4];
    ep_display = maingateway[5] + ' / ' + maingateway[6];

    $monitor_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        block_id:   maingateway[0],        
        block_name: maingateway[1],
        dimming:    btn_dimming_mode,
        mg:         maingateway[2],
        sg:         sg_display,
        ep:         ep_display,
        issue:      mg_issue
      }
    });

    if (refresh != 'refresh') {
      $("#block_select").append($('<option></option>').val(maingateway[0]).html(maingateway[1]));
      $("#map_block_select").append($('<option></option>').val(maingateway[0]).html(maingateway[1]));
    }
  }
});

function selectMode(e) {
  var mgid = e.id;

  var mode_id = '#' + mgid + 'mode';
  var mode    = $(mode_id).val();

  socket.emit('client2server_change_mode', mgid, mode);
}

var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1,
  maxZoom: 3,
  zoomSnap: 0.5,
  attributionControl: false
});

function cellStyle(value, row, index) {
  if (value.trim() == 'ONLINE') {
    return {
      css: {
        'background-color': 'yellowgreen',
        'color': 'white'
      }
    }
  } else if (value.trim() == 'OFFLINE') {
    return {
      css: {
        'background-color': 'crimson',
        'color': 'white'
      }
    }
  } else if (value.trim() == 'PENDING') {
    return {
      css: {
        'background-color': 'orange',
        'color': 'white'
      }
    }
  } else if (value.trim() == 'DRIVER NO RESPONSE') {
    return {
      css: {
        'background-color': 'DarkTurquoise',
        'color': 'white'
      }
    }
  } else if (value.trim() == 'LAMP NO RESPONSE') {
    return {
      css: {
        'background-color': 'DarkTurquoise',
        'color': 'white'
      }
    }
  }

  return {};
};

function cellStyle_Issue(value, row, index) {
  if (value.trim() == '<span class="fas fa-check"></span>') {
    return {
      css: {
        'background-color': 'yellowgreen',
        'color': 'white'
      }
    }
  } else if (value.trim() == '<span class="fas fa-exclamation"></span>') {
    return {
      css: {
        'background-color': 'orange',
        'color': 'white'
      }
    }
  }

  return {};
};

function cellStyle_Summary(value, row, index) {
  var num = value.trim().split('/');

  if (parseInt(num[1], 10) != 0) {
    if (parseInt(num[0], 10) < parseInt(num[1], 10)) {
      if (parseInt(num[0], 10) == 0) {
        return {
          css: {
            'background-color': 'crimson',
            'color': 'white'
          }
        }
      } else {
        return {
          css: {
            'background-color': 'orange',
            'color': 'white'
          }
        }
      }
    }
  }
  
  return {};
};

//////////////////////////////////////////////////////////////////////

function sync_trigger(element) {
  var EPID = element.id;

  socket.emit('client2server_EP_Operation', EPID, '20', '');

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });
};

function functional_trigger(element) {
  var EPID = element.id;

  socket.emit('client2server_EP_Operation', EPID, '10', '');

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });
};

function duration_trigger(element) {
  var EPID = element.id;

  socket.emit('client2server_EP_Operation', EPID, '11', '');

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  
};

function blink_trigger(element) {
  var EPID = element.id;

  socket.emit('client2server_EP_Operation', EPID, '12', '');

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  
};

function set_sensor(element) {
  var EPID = element.id;

  var sensor_id = '#' + EPID + 'sensor';
  var SENSOR = $(sensor_id).val();
  socket.emit('client2server_EP_Operation', EPID, '2a', SENSOR);

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  
};

function set_dimming(element) {
  var EPID = element.id;

  var dimming_id = '#' + EPID + 'dimming';
  var DIMMING    = $(dimming_id).val();

  socket.emit('client2server_EP_Operation', EPID, '27', DIMMING);

  $device_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  $floor_table.bootstrapTable('updateCellByUniqueId', {
    id: EPID,
    field: 'connection',
    value: 'PENDING'
  });

  
};

function tick(id) {
  var EPID = id;

  var msg = '<div class="btn-group" role="group">'
        + '  <button class="btn btn-link button-blue" id="'   + EPID + '" onclick="sync_trigger(this)" data-toggle="tooltip" data-placement="top" title="Sync Lamp Status"><span class="fas fa-sync"></span></button>'
        + '  <button class="btn btn-link button-yellow" id="' + EPID + '" onclick="blink_trigger(this)" data-toggle="tooltip" data-placement="top" title="Blink Lamp"><span class="fas fa-lightbulb"></span></button>'
        + '  <button class="btn btn-link button-green" id="'  + EPID + '" onclick="functional_trigger(this)" data-toggle="tooltip" data-placement="top" title="Start Functional Test"><span class="fas fa-vial"></span></button>'
        + '  <button class="btn btn-link button-orange" id="' + EPID + '" onclick="duration_trigger(this)" data-toggle="tooltip" data-placement="top" title="Start Duration Test"><span class="fas fa-vials"></span></button>'
        + '</div>';

  return msg;
};

//////////////////////////////////////////////////////////////////////

function block_refresh() {
  var MGID = $('#block_select').val();
  $device_table.bootstrapTable('removeAll');

  if (MGID.indexOf('SELECT') == -1) {
    socket.emit('client2server_EP', MGID);
  }
};

socket.on('server2client_EP', function(EPID, SGID, Connection, Light, functional_test, durational_test, blink_test, nickname, group, type, floor, watt) {

  var tick = '<div class="btn-group" role="group">'
           + '  <button class="btn btn-info" id="'    + EPID + '" onclick="sync_trigger(this)" data-toggle="tooltip" data-placement="top" title="Sync Lamp Status"><span class="fas fa-sync"></span></button>'
           + '  <button class="btn btn-success" id="' + EPID + '" onclick="blink_trigger(this)" data-toggle="tooltip" data-placement="top" title="Blink Lamp"><span class="fas fa-lightbulb"></span></button>'
           + '  <button class="btn btn-success" id="' + EPID + '" onclick="functional_trigger(this)" data-toggle="tooltip" data-placement="top" title="Start Functional Test"><span class="fas fa-vial"></span></button>'
           + '  <button class="btn btn-success" id="' + EPID + '" onclick="duration_trigger(this)" data-toggle="tooltip" data-placement="top" title="Start Duration Test"><span class="fas fa-vials"></span></button>'
           + '</div>';

  var tick2 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_sensor(this)"  data-toggle="tooltip" data-placement="top" title="Set Sensor Hold Time"><span class="fas fa-walking"></span></button>'
            + '  <select class="form-control" id="' + EPID + 'sensor">'
            + '    <option value="80" selected>5 sec</option>'
            + '    <option value="81">10 sec</option>'
            + '    <option value="82">15 sec</option>'
            + '    <option value="83">20 sec</option>'
            + '    <option value="84">30 sec</option>'
            + '    <option value="85">1 min</option>'
            + '    <option value="86">2 min</option>'
            + '    <option value="87">3 min</option>'
            + '    <option value="88">5 min</option>'
            + '    <option value="89">10 min</option>'
            + '    <option value="8a">15 min</option>'
            + '    <option value="8b">20 min</option>'
            + '    <option value="8c">30 min</option>'
            + '    <option value="8d">40 min</option>'
            + '    <option value="8e">60 min</option>'
            + '    <option value="8f">120 min</option>'
            + '</div>';

  var tick3 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_dimming(this)"  data-toggle="tooltip" data-placement="top" title="Set Dimming Level"><span class="fas fa-adjust"></span></button>'
            + '  <select class="form-control" id="' + EPID + 'dimming">'
            + '    <option value="00" selected>0%</option>'
            + '    <option value="10">10%</option>'
            + '    <option value="20">20%</option>'
            + '    <option value="30">30%</option>'
            + '    <option value="40">40%</option>'
            + '    <option value="50">50%</option>'
            + '    <option value="60">60%</option>'
            + '    <option value="70">70%</option>'
            + '    <option value="80">80%</option>'
            + '    <option value="90">90%</option>'
            + '    <option value="a0">100%</option>'
            + '</div>';

  if(getDriverStatus_SENSOR(Light) == 'No Sensor Built-In') {
    tick2 = 'N/A';

    if (EPID == '100003fa') {
      tick2 = '<div class="btn-group" role="group">'
          + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_sensor(this)"  data-toggle="tooltip" data-placement="top" title="Set Sensor Hold Time"><span class="fas fa-walking"></span></button>'
          + '  <select class="form-control" id="' + EPID + 'sensor">'
          + '    <option value="80" selected>5 sec</option>'
          + '    <option value="81">10 sec</option>'
          + '    <option value="82">15 sec</option>'
          + '    <option value="83">20 sec</option>'
          + '    <option value="84">30 sec</option>'
          + '    <option value="85">1 min</option>'
          + '    <option value="86">2 min</option>'
          + '    <option value="87">3 min</option>'
          + '    <option value="88">5 min</option>'
          + '    <option value="89">10 min</option>'
          + '    <option value="8a">15 min</option>'
          + '    <option value="8b">20 min</option>'
          + '    <option value="8c">30 min</option>'
          + '    <option value="8d">40 min</option>'
          + '    <option value="8e">60 min</option>'
          + '    <option value="8f">120 min</option>'
          + '</div>';
    }
  }

  var power = displayWatt(watt);
  if (power == 'W') {
    power = '';
  }

  $device_table.bootstrapTable('insertRow', {
    index: 1,
    row: {
      epid:           EPID,
      request_sync:   tick,
      sensor_set:     tick2,
      dimming_set:    tick3,
      connection:     Connection,
      devices:        '<b>' + displayDevice(EPID) + '</b>',
      sg:             displayDevice(SGID),
      ac:             getDriverStatus_AC(Light),
      m_switch:       getDriverStatus_SWITCH(Light),
      sync:           getDriverStatus_SYNC(Light),
      sensor:         getDriverStatus_SENSOR(Light),
      battery:        getDriverStatus_BATTERY(Light),
      pwm:            getDriverStatus_PWM(Light),
      pwm_mode:       getDriverStatus_MODE(Light),
      sensor_mode:    getDriverStatus_SENSOR_MODE(Light),
      sensor_hold:    getDriverStatus_HOLDTIME(Light),
      func_test_res:  functional_test,
      dura_test_res:  durational_test,
      blink_test_res: blink_test,
      nickname:       nickname,
      group:          group,
      type:           type,
      floor:          floor,
      watt:           power
    }
  });
});

//////////////////////////////////////////////////////////////////////

function map_block_refresh() {
  var MGID = $('#map_block_select').val();
  var site = PROPERTY;

  $floor_table.bootstrapTable('removeAll');

  if (MGID.indexOf('SELECT') == -1) {
    socket.emit('client2server_get_map', MGID, site);
  }
  
  var i = 0;
  var L = document.getElementById("map_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
    document.getElementById("map_select").remove(i);
  }

  map.eachLayer(function(layer) {
    map.removeLayer(layer);
  });

  var map_path = '/images/default_image.png';
  var image    = L.imageOverlay(map_path, bounds).addTo(map);
  map.fitBounds(bounds);
  map.setZoom(0);
};

socket.on('server2client_get_map', function(mapList) {
  for(i = 0; i < mapList.length; i++) {
    var content = mapList[i].split(',');

    var name = content[0];
    var src  = content[1];

    $("#map_select").append($('<option></option>').val(content[1]).html(content[0]));
  }
});

//////////////////////////////////////////////////////////////////////

function loadMap() {
  var floor_img = $("#map_select").val();
  var floor = $("#map_select option:selected").text();
  var block = $("#map_block_select").val();
  var map_path = '';

  map.eachLayer(function(layer) {
    map.removeLayer(layer);
  });

  $floor_table.bootstrapTable('removeAll');

  if (floor_img.indexOf('SELECT') == -1) {
    socket.emit('client2server_home_loadMap', block, floor);
    socket.emit('client2server_home_loadFloor', block, floor);

    map_path = '/uploads/' + floor_img;

  } else {
    map_path = '/images/default_image.png';
  }
  
  var image = L.imageOverlay(map_path, bounds).addTo(map);
  map.fitBounds(bounds);
  map.setZoom(0);
};

socket.on('server2client_home_loadMap', function(lampList) {
  for(i = 0; i < lampList.length; i++) {
      var lamp = lampList[i].split(',');
      var id   = lamp[0];
      var y    = lamp[1];
      var x    = lamp[2];
      var type = lamp[3];

      var sol = L.latLng(x, y);

      var lamp_icon = new L.Icon({
          iconUrl: lamptype[type],
          iconAnchor:    [38, 70],
          popupAnchor:   [0, -65],
          tooltipAnchor: [0, -15]
      });

      if (type.indexOf('Gateway') == -1) {
        console.log(id + ': ' + type);

        var marker = new L.marker(sol, {icon: lamp_icon})
                    .bindTooltip(id, {direction: "bottom", permanent: "true"})
                    .bindPopup(tick(id), { className: 'stylePopup' })
                    .addTo(map);

        map.addLayer(marker);

      } else {
        var marker = new L.marker(sol, {icon: lamp_icon})
                    .bindTooltip(id, {direction: "bottom", permanent: "true"})
                    .addTo(map);

        map.addLayer(marker);
      }
  }
});

socket.on('server2client_EP_floor', function(EPID, SGID, Connection, Light, functional_test, durational_test, blink_test, nickname, group, type, floor, watt) {
  var tick2 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_sensor(this)"  data-toggle="tooltip" data-placement="top" title="Set Sensor Hold Time"><span class="fas fa-walking"></span></button>'
            + '  <select class="form-control" id="'    + EPID + 'sensor">'
            + '    <option value="80" selected>5 sec</option>'
            + '    <option value="81">10 sec</option>'
            + '    <option value="82">15 sec</option>'
            + '    <option value="83">20 sec</option>'
            + '    <option value="84">30 sec</option>'
            + '    <option value="85">1 min</option>'
            + '    <option value="86">2 min</option>'
            + '    <option value="87">3 min</option>'
            + '    <option value="88">5 min</option>'
            + '    <option value="89">10 min</option>'
            + '    <option value="8a">15 min</option>'
            + '    <option value="8b">20 min</option>'
            + '    <option value="8c">30 min</option>'
            + '    <option value="8d">40 min</option>'
            + '    <option value="8e">60 min</option>'
            + '    <option value="8f">120 min</option>'
            + '</div>';

  var tick3 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_dimming(this)"  data-toggle="tooltip" data-placement="top" title="Set Dimming Level"><span class="fas fa-adjust"></span></button>'
            + '  <select class="form-control" id="' + EPID + 'dimming">'
            + '    <option value="00" selected>0%</option>'
            + '    <option value="10">10%</option>'
            + '    <option value="20">20%</option>'
            + '    <option value="30">30%</option>'
            + '    <option value="40">40%</option>'
            + '    <option value="50">50%</option>'
            + '    <option value="60">60%</option>'
            + '    <option value="70">70%</option>'
            + '    <option value="80">80%</option>'
            + '    <option value="90">90%</option>'
            + '    <option value="a0">100%</option>'
            + '</div>';

  if(getDriverStatus_SENSOR(Light) == 'No Sensor Built-In') {
    tick2 = 'N/A';

  } else {
    tick2 = '<div class="btn-group" role="group">'
        + '  <button class="btn btn-warning" id="' + EPID + '" onclick="set_sensor(this)"  data-toggle="tooltip" data-placement="top" title="Set Sensor Hold Time"><span class="fas fa-walking"></span></button>'
        + '  <select class="form-control" id="' + EPID + 'sensor">'
        + '    <option value="80" selected>5 sec</option>'
        + '    <option value="81">10 sec</option>'
        + '    <option value="82">15 sec</option>'
        + '    <option value="83">20 sec</option>'
        + '    <option value="84">30 sec</option>'
        + '    <option value="85">1 min</option>'
        + '    <option value="86">2 min</option>'
        + '    <option value="87">3 min</option>'
        + '    <option value="88">5 min</option>'
        + '    <option value="89">10 min</option>'
        + '    <option value="8a">15 min</option>'
        + '    <option value="8b">20 min</option>'
        + '    <option value="8c">30 min</option>'
        + '    <option value="8d">40 min</option>'
        + '    <option value="8e">60 min</option>'
        + '    <option value="8f">120 min</option>'
        + '</div>';
  }

  var power = displayWatt(watt);
  if (power == 'W') {
    power = '';
  }

  $floor_table.bootstrapTable('insertRow', {
    index: 1,
    row: {
      epid:           EPID,
      connection:     Connection,
      sensor_set:     tick2,
      dimming_set:    tick3,
      devices:        '<b>' + displayDevice(EPID) + '</b>',
      sg:             displayDevice(SGID),
      ac:             getDriverStatus_AC(Light),
      m_switch:       getDriverStatus_SWITCH(Light),
      sync:           getDriverStatus_SYNC(Light),
      sensor:         getDriverStatus_SENSOR(Light),
      battery:        getDriverStatus_BATTERY(Light),
      pwm:            getDriverStatus_PWM(Light),
      pwm_mode:       getDriverStatus_MODE(Light),
      sensor_mode:    getDriverStatus_SENSOR_MODE(Light),
      sensor_hold:    getDriverStatus_HOLDTIME(Light),
      func_test_res:  functional_test,
      dura_test_res:  durational_test,
      blink_test_res: blink_test,
      nickname:       nickname,
      group:          group,
      type:           type,
      floor:          floor,
      watt:           power
    }
  });
});

socket.on('server2client_EP_update', function(EPID, Connection, Light, functional_test, durational_test, blink_test) {
  $device_table.bootstrapTable('updateByUniqueId', {
    id: EPID,
    row: {
      connection:     Connection,
      ac:             getDriverStatus_AC(Light),
      m_switch:       getDriverStatus_SWITCH(Light),
      sync:           getDriverStatus_SYNC(Light),
      sensor:         getDriverStatus_SENSOR(Light),
      battery:        getDriverStatus_BATTERY(Light),
      pwm:            getDriverStatus_PWM(Light),
      pwm_mode:       getDriverStatus_MODE(Light),
      sensor_mode:    getDriverStatus_SENSOR_MODE(Light),
      sensor_hold:    getDriverStatus_HOLDTIME(Light),
      func_test_res:  functional_test,
      dura_test_res:  durational_test,
      blink_test_res: blink_test
    }
  });

  $floor_table.bootstrapTable('updateByUniqueId', {
    id: EPID,
    row: {
      connection:     Connection,
      ac:             getDriverStatus_AC(Light),
      m_switch:       getDriverStatus_SWITCH(Light),
      sync:           getDriverStatus_SYNC(Light),
      sensor:         getDriverStatus_SENSOR(Light),
      battery:        getDriverStatus_BATTERY(Light),
      pwm:            getDriverStatus_PWM(Light),
      pwm_mode:       getDriverStatus_MODE(Light),
      sensor_mode:    getDriverStatus_SENSOR_MODE(Light),
      sensor_hold:    getDriverStatus_HOLDTIME(Light),
      func_test_res:  functional_test,
      dura_test_res:  durational_test,
      blink_test_res: blink_test
    }
  });
});
