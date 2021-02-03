$(function() {
  $('#sg_table').bootstrapTable()
});

var $table = $('#sg_table');

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
  }
  else if (value.trim() == 'PENDING') {
    return {
      css: {
        'background-color': 'orange',
        'color': 'white'
      }
    }
  }

  return {};
}

function displayPath(payload) {
  if (payload.length > 8) {
    return payload.match(/.{8}/g).join(' ');
  } else {
    return payload;
  }
};

function refresh() {
  socket.emit('client2server_SG', '');
  disableButtonUltraShort();
  $table.bootstrapTable('removeAll');
};

function getStatus(element) {
  var SGID = element.id;
  socket.emit('client2server_SG_Operation', SGID, '20', '');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function reconfigPath(element) {
  var SGID = element.id;

  var rssi_id = '#' + SGID + 'rssi';
  var RSSI = $(rssi_id).val();
  socket.emit('client2server_SG_Operation', SGID, '03', RSSI);

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function setCoordinator(element) {
  var SGID = element.id;
  socket.emit('client2server_SG_Operation', SGID, '2c');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function resetSG(element) {
  var SGID = element.id;
  socket.emit('client2server_SG_Operation', SGID, '19');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function resetSGEP(element) {
  var SGID = element.id;
  socket.emit('client2server_SG_Operation', SGID, '1b');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function removeCoordinator(element) {
  var SGID = element.id;
  socket.emit('client2server_SG_Operation', SGID, '2d');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function freqSG(element) {
  var SGID = element.id;

  var freq_id = '#' + SGID + 'freq';
  var FREQ = $(freq_id).val();
  socket.emit('client2server_SG_Operation', SGID, '2e', FREQ);

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

function restartSG(element) {
  var SGID = element.id;

  socket.emit('client2server_SG_Operation', SGID, '2f', '');

  $table.bootstrapTable('updateCellByUniqueId', {
    id: SGID,
    field: 'connection',
    value: 'PENDING'
  });
};

socket.on('server2client_SG', function(SGID, parentMG, connection_status, RSSI, coor, opt_path, listen_to) {

  var tick1 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-info" id="' + SGID + '" onclick="getStatus(this)"  data-toggle="tooltip" data-placement="top" title="Sync Status"><span class="fas fa-sync"></span></button>'
            + '  <button class="btn btn-info" id="' + SGID + '" onclick="setCoordinator(this)"  data-toggle="tooltip" data-placement="top" title="Set Coordinator"><span class="fas fa-satellite-dish"></span></button>'
            + '  <button class="btn btn-info" id="' + SGID + '" onclick="reconfigPath(this)"  data-toggle="tooltip" data-placement="top" title="Reconfig Path"><span class="fas fa-project-diagram"></span></button>'
            + '  <select class="form-control" id="' + SGID + 'rssi">'
            + '    <option value="46">Rank 1</option>'
            + '    <option value="50">Rank 2</option>'
            + '    <option value="5a">Rank 3</option>'
            + '    <option value="64" selected>Rank 4</option>'
            + '    <option value="6e">Rank 5</option>'
            + '    <option value="78">Rank 6</option>'
            + '</div>';

  var tick2 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + SGID + '" onclick="restartSG(this)"  data-toggle="tooltip" data-placement="top" title="Restart Sub-Gateway"><span class="fas fa-power-off"></span></button>'
            + '  <button class="btn btn-danger" id="'  + SGID + '" onclick="resetSG(this)"  data-toggle="tooltip" data-placement="top" title="Reset Sub-Gateway"><span class="fas fa-trash"></span></button>'
            + '  <button class="btn btn-danger" id="'  + SGID + '" onclick="resetSGEP(this)"  data-toggle="tooltip" data-placement="top" title="Reset Powerline"><span class="fas fa-dumpster"></span></button>'
            + '  <button class="btn btn-danger" id="'  + SGID + '" onclick="removeCoordinator(this)"  data-toggle="tooltip" data-placement="top" title="Remove Coordinator"><span class="fas fa-satellite-dish"></span></button>'
            + '</div>';

  var tick3 = '<div class="btn-group" role="group">'
            + '  <button class="btn btn-warning" id="' + SGID + '" onclick="freqSG(this)"  data-toggle="tooltip" data-placement="top" title="Switch Sub-Gateway Frequency"><span class="fas fa-broadcast-tower"></span></button>'
            + '  <select class="form-control" id="' + SGID + 'freq">'
            + '    <option value="06" selected>1st Frequency (110kHz)</option>'
            + '    <option value="07">2nd Frequency (132kHz)</option>'
            + '    <option value="05">3rd Frequency (86kHz)</option>'
            + '</div>';

  $table.bootstrapTable('insertRow', {
    index: 1,
    row: {
      sg: SGID,
      operation: tick1,
      configuration: tick2,
      frequency: tick3,
      connection: connection_status,
      rssi: RSSI,
      coordinator: coor,
      sg_display: '<b>' + displayDevice(SGID) + '</b>',
      opt_path: displayPath(opt_path),
      listen_to: displayPath(listen_to),
      mg: displayDevice(parentMG),
    }
  })
});