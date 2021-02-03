var $table = $('#advanced_table');

$(function() {
  $table.bootstrapTable({disableUnusedSelectOptions: true});

  socket.emit('client2server_advanced', '');
});

function displayPath(payload) {
  if (payload.length > 8) {
    return payload.match(/.{8}/g).join(' ');
  } else {
    return payload;
  }
};

function clearTable() {
  $table.bootstrapTable('removeAll');
  $table.bootstrapTable('hideColumn', 'layer');
  $table.bootstrapTable('hideColumn', 'no');
  $table.bootstrapTable('hideColumn', 'progress');
  $table.bootstrapTable('hideColumn', 'rssi');

  disableButtonUltraShort();
};

function pingEP() {
  var ep = $('#epid_ping').val();
  var mg = $('#admin_mg').val();

  disableButtonShort();
  socket.emit('client2server_pingEP', mg, ep, '31');
};

function resetEP() {
  var ep = $('#epid_reset').val();
  var mg = $('#admin_mg').val();

  disableButtonShort();
  socket.emit('client2server_pingEP', mg, ep, '1a');
};

function resetSG() {
  var sg = $('#sgid_reset').val();
  var mg = $('#admin_mg').val();

  disableButtonShort();
  socket.emit('client2server_pingEP', mg, sg, '19a');
};

function repeatLoRa() {
  var sg = $('#sgid_lora').val();
  var mg = $('#admin_mg').val();

  disableButtonShort();
  socket.emit('client2server_pingEP', mg, sg, '06');
};

function getEPListfromSG() {
  var sg = $('#sgid_follower').val();
  var mg = $('#admin_mg').val();

  disableButtonShort();
  socket.emit('client2server_pingEP', mg, sg, '0a');
};

function pingMGOperation() {
  var mg   = $('#admin_mg').val();
  var func = $('#mg_operation').val();

  disableButtonShort();
  socket.emit('client2server_pingMG', mg, func);
};

function pingMG() {
  disableButtonShort();
  socket.emit('client2server_ping_mg', '');

  setTimeout(function() {
    socket.emit('client2server_advanced', '');
  }, 1000);
}

function admin_trigger() {
  var MGID = $('#admin_mg').val();
  var func = $('#func').val();
  var oldID = $('#old_id').val();
  var newID = $('#new_id').val();

  var devices = $table.bootstrapTable('getSelections');

  var Content = '';
  var EPList  = {};

  switch(func) {
      case '00':
          Content = $('#layer').val() + ',' + $('#rssi_threshold').val();
          break;
      
      case '08':
          break;

      case '01':
          $table.bootstrapTable('showColumn', 'progress');

          Content = $('#rssi_threshold').val() + ',';

          for(var i = 0; i < devices.length; i++) {
              Content += devices[i]['sg'];

              $table.bootstrapTable('updateCellByUniqueId', {
                id: devices[i]['sg'],
                field: 'progress',
                value: '<span class="fas fa-spinner fa-spin"></span>'
              });

              /*
              $table.bootstrapTable('updateCell', {
                  index: i,
                  field: 'progress',
                  value: '<span class="fas fa-spinner fa-spin"></span>'
              });
              */
          }
          break;
      
      case '0b':
          $table.bootstrapTable('showColumn', 'progress');

          for(var i = 0; i < devices.length; i++) {
              var id = devices[i]['ep'].match(/.{1,8}/g);

              if (id[0] == id[1]) {
                  $table.bootstrapTable('updateCell', {
                      index: i,
                      field: 'progress',
                      value: '<span class="fas fa-spinner fa-spin"></span>'
                  });
              }

              if (EPList.hasOwnProperty(id[0])) {
                  if (id[0] != id[1]) {
                      var str = EPList[id[0]];
                      str += id[1];
                      EPList[id[0]] = str;
                  }

              } else {
                  if (id[0] != id[1]) {
                      EPList[id[0]] = id[1];
                  } else {
                      EPList[id[0]] = '';
                  }
              }
          }

          for (var sg in EPList) {
              if (EPList.hasOwnProperty(sg)) {
                  Content += sg + EPList[sg] + ',';
              }
          }
          break;
      
      case '0e':
          Content = oldID + ',' + newID;
          break;

      case '26':
          Content = '';
          break;
      
      default:
          break;
  }

  if ((func == '08') || (func == '00')) {
    disableButtonLong();
  } else {
    disableButtonShort();
  }

  socket.emit('client2server_admin', func, MGID, Content);
};

socket.on('server2client_advanced', function(mgList) {
  var i = 0;
  var L = document.getElementById("admin_mg").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("admin_mg").remove(i);
  }
  
  for(i = 0; i < mgList.length; i++) {
    $("#admin_mg").append($('<option></option>').val(mgList[i]).html(displayDevice(mgList[i])));
  }
});

socket.on('server_sg_advanced', function(SGID, Layer, RSSI) {
  var layer_base = $('#layer').val() - Layer;

  $table.bootstrapTable('hideColumn', 'no');
  $table.bootstrapTable('showColumn', 'layer');
  $table.bootstrapTable('showColumn', 'rssi');

  var devices  = $table.bootstrapTable('getData');
  var repeated = false;

  for(var i = 0; i < devices.length; i++) {
      if (SGID == devices[i]['sg']) {
          repeated = true;
      }
  }

  if (!repeated) {
      $table.bootstrapTable('insertRow', {
          index: 1,
          row: {
              sg: SGID,
              ep: SGID,
              sg_display: displayDevice(SGID),
              content: '',
              layer: layer_base,
              rssi: RSSI,
          }
      });
  }

  console.log('[socket.io]server_sg_advanced: ' + SGID + ' ' + Layer + ' ' + RSSI);
});

socket.on('server_ep_advanced', function(SGID, Content) {
  $table.bootstrapTable('hideColumn', 'layer');
  $table.bootstrapTable('hideColumn', 'rssi');
  $table.bootstrapTable('showColumn', 'no');

  console.log('[socket.io]server_ep_advanced: ' + SGID + ' ' + Content);

  var EPID = Content.match(/.{1,8}/g);
  console.log(EPID);

  $table.bootstrapTable('remove', {
    field: 'sg',
    values: SGID
  });

  var i = 0;
  for (i; i < EPID.length; i++) {
    if (i == 0) {
      $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
            sg: SGID,
            ep: SGID + EPID[i],
            sg_display: displayDevice(SGID),
            content: displayDevice(SGID),
            no: EPID.length,
        }
      });
    } else {
      $table.bootstrapTable('insertRow', {
        index: 2,
        row: {
            sg: SGID,
            ep: SGID + EPID[i],
            sg_display: '',
            content: displayDevice(EPID[i]),
            no: '',
        }
      });
    }
  }
});

socket.on('server_acknowledge_advanced', function(SGID) {

  $table.bootstrapTable('updateCellByUniqueId', {
      id: SGID,
      field: 'progress',
      value: '<span class="fas fa-check"></span>'
  });

  $table.bootstrapTable('uncheck', {
      field: 'sg',
      values: SGID
  });
});

socket.on('server_acknowledge_advanced_fail', function(SGID) {

  $table.bootstrapTable('updateCellByUniqueId', {
      id: SGID,
      field: 'progress',
      value: '<span class="fas fa-times"></span>'
  });
});

socket.on('server_ep_ping', function(MGID, SGID, EPID, Content, Freq) {
  var cont1 = '';
  var cont2 = '';

  switch (Content) {
    case '00':
      cont1 = 'EP has not been locked'
      break;

    case '01':
      cont1 = 'EP has been locked'
      break;
  };

  switch (Freq) {
    case '05':
      cont2 = '3rd Frequency (86kHz)'
      break;

    case '06':
      cont2 = '1st Frequency (110kHz)'
      break;

    case '06':
      cont2 = '2nd Frequency (132kHz)'
      break;
  };

  var message = 'Ping EP Result:\n\n' + 'EPID: ' + EPID + '\nMGID: ' + MGID + '\nSGID: ' + SGID + '\nContent: ' + cont1 + '\nCurrent Frequency: ' + cont2;
  alert(message);
});

socket.on('server_ep_reset', function(EPID) {
  var message = 'EPID: ' + EPID + ' has been reset';
  alert(message);
});

socket.on('server_sg_lora', function(SGID, Content) {
  var message = 'SGID: ' + SGID + '\nLoRa Repeat ID: ' + displayPath(Content);
  alert(message);
});

socket.on('server_sg_follower', function(SGID, Content) {
  var message = 'SGID: ' + SGID + '\nFollower ID: ' + Content;
  alert(message);
});