var $create_table   = $('#create_table');
var $add_table      = $('#add_table');
var $nickname_table = $('#nickname_table');
var $type_table     = $('#type_table');

$(function() {
  $create_table.bootstrapTable();
  $add_table.bootstrapTable({disableUnusedSelectOptions: true});
  $nickname_table.bootstrapTable();
  $type_table.bootstrapTable({disableUnusedSelectOptions: true});

  socket.emit('client2server_group_getProperty', '');
});

socket.on('server2client_group_getProperty', function(siteList, typeList) {
  for(i = 0; i < siteList.length; i++) {
      $("#create_site_select").append($('<option></option>').val(siteList[i]).html(siteList[i]));
      $("#add_site_select").append($('<option></option>').val(siteList[i]).html(siteList[i]));
      $("#nickname_site_select").append($('<option></option>').val(siteList[i]).html(siteList[i]));
      $("#type_site_select").append($('<option></option>').val(siteList[i]).html(siteList[i]));
  }

  for(i = 0; i < typeList.length; i++) {
    $("#lamp_type_select").append($('<option></option>').val(typeList[i]).html(typeList[i]));
  }
});

//////////////////////////////////////////////////////////////////////
// Create New Group
function refreshCreateBlock() {
  var site = $("#create_site_select").val();

  var i = 0;
  var L = document.getElementById("create_block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("create_block_select").remove(i);
  }

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshCreateBlock', site);
  }
}

socket.on('server2client_group_refreshCreateBlock', function(blockList) {
  for(i = 0; i < blockList.length; i++) {
      var block = blockList[i].split(',');

      $("#create_block_select").append($('<option></option>').val(block[1]).html(block[0]));
  }
});

function refreshCreateTable() {
  var block = $("#create_block_select").val();
  var site  = $("#create_site_select").val();

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (block.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshCreateTable', block, site);
  }
}

socket.on('server2client_group_refreshCreateTable', function(groupList) {
  for(i = 0; i < groupList.length; i++) {
    var group = groupList[i].split('=');

    var btn_delete = '<button class="btn btn-danger btn-sm" value="' + group[0] + '" onclick="deleteGroup(this)" data-toggle="tooltip" data-placement="top" title="Delete this Group"><span class="fas fa-trash"></span></button>';

    $create_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        create_delete: btn_delete,
        create_group:  group[0],
        create_list:   group[1],
      }
    });
  }
});

function createGroup() {
  var block = $("#create_block_select").val();
  var site  = $("#create_site_select").val();
  var name  = $("#create_group_name").val();

  socket.emit('client2server_group_createGroup', name, block, site);
}

socket.on('server2client_group_createGroup', function(name, num) {
  if (num == 1) {
    alert('Duplicate Group! Abort Creation.');
  } else {
    var btn_delete = '<button class="btn btn-danger btn-sm" value="' + name + '" onclick="deleteGroup(this)" data-toggle="tooltip" data-placement="top" title="Delete this Group"><span class="fas fa-trash"></span></button>';

    $create_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        create_delete: btn_delete,
        create_group:  name,
        create_list:   num,
      }
    });
  }
});

function deleteGroup(e) {
  var group = e.value;
  var block = $("#create_block_select").val();
  var site  = $("#create_site_select").val();

  var prompt_msg = 'Please enter the Group Name "' + group + '" to confirm delete.';
  var confirmation = prompt(prompt_msg , '');

  if (confirmation == group) {
    socket.emit('client2server_group_delete', group, block, site);
  } else {
    alert('Input Name is wrong! Abort deletion.');
  }
};

socket.on('server2client_group_delete', function(group, result) {
  if (result == 'success') {
    $create_table.bootstrapTable('removeByUniqueId', group);
  } else {
    alert('Group "' + group + '" has error when delete.');
  }
});

//////////////////////////////////////////////////////////////////////
// Add Devices to Group
function refreshAddBlock() {
  var site = $("#add_site_select").val();

  var i = 0;
  var L = document.getElementById("add_block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("add_block_select").remove(i);
  }

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshAddBlock', site);
  }
  
}

socket.on('server2client_group_refreshAddBlock', function(blockList) {
  for(i = 0; i < blockList.length; i++) {
      var block = blockList[i].split(',');

      $("#add_block_select").append($('<option></option>').val(block[1]).html(block[0]));
  }
});

function refreshAddTable() {
  var block = $("#add_block_select").val();
  var site  = $("#add_site_select").val();

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');
  
  var i = 0;
  var L = document.getElementById("add_group_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("add_group_select").remove(i);
  }

  if (block.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshAddTable', block, site);
  }
}

socket.on('server2client_group_refreshAddTable', function(deviceList, groupList) {
  for(i = 0; i < deviceList.length; i++) {
    var ep = deviceList[i].split('=');

    $add_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        add_ep:       ep[0],
        add_nickname: ep[1],
        add_group:    ep[2],
      }
    });
  }

  for(i = 0; i < groupList.length; i++) {
    $("#add_group_select").append($('<option></option>').val(groupList[i]).html(groupList[i]));
  }
});

function addGroup() {
  var devices = $add_table.bootstrapTable('getSelections');
  var group   = $("#add_group_select").val();
  var epList  = [];

  for(i = 0; i < devices.length; i++) {
    epList.push(devices[i]['add_ep']);
  }

  if (group.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_addGroup', group, epList);
  }

  $add_table.bootstrapTable('uncheckAll');
}

socket.on('server2client_group_addGroup', function(group, result, epList) {
  if (result == 'success') {
    for(i = 0; i < epList.length; i++) {
      $add_table.bootstrapTable('updateByUniqueId', {
        id: epList[i],
        row: {
          add_group: group
        }
      });
    }
  } else {
    alert('Group "' + group + '" has error when adding devices.');
  }
});

//////////////////////////////////////////////////////////////////////
// Set Description and Watt
function refreshNicknameBlock() {
  var site = $("#nickname_site_select").val();

  var i = 0;
  var L = document.getElementById("nickname_block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("nickname_block_select").remove(i);
  }

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshNicknameBlock', site);
  }
}

socket.on('server2client_group_refreshNicknameBlock', function(blockList) {
  for(i = 0; i < blockList.length; i++) {
      var block = blockList[i].split(',');

      $("#nickname_block_select").append($('<option></option>').val(block[1]).html(block[0]));
  }
});

function refreshNicknameTable() {
  var block = $("#nickname_block_select").val();

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (block.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshNicknameTable', block);
  }
}

socket.on('server2client_group_refreshNicknameTable', function(deviceList) {
  for(i = 0; i < deviceList.length; i++) {
    var ep = deviceList[i].split('=');

    $nickname_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        nickname_ep:    ep[0],
        nickname_group: ep[1],
        nickname_type:  ep[2],
        nickname_name:  ep[3],
        nickname_floor: ep[4],
        nickname_type:  ep[5],
        nickname_watt:  ep[6]
      }
    });
  }
});

function editDescription() {
  var epid = $("#nickname_set_id").val();
  var name = $("#nickname_set_name").val();

  socket.emit('client2server_group_editDescription', epid, name);
};

socket.on('server2client_group_editDescription', function(ep, name) {
  $nickname_table.bootstrapTable('updateByUniqueId', {
    id: ep,
    row: {
      nickname_name: name,
    }
  });
});

//////////////////////////////////////////////////////////////////////
// Set Lamp Type
function refreshTypeBlock() {
  var site = $("#type_site_select").val();

  var i = 0;
  var L = document.getElementById("type_block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("type_block_select").remove(i);
  }

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_refreshTypeBlock', site);
  }
}

socket.on('server2client_group_refreshTypeBlock', function(blockList) {
  for(i = 0; i < blockList.length; i++) {
      var block = blockList[i].split(',');

      $("#type_block_select").append($('<option></option>').val(block[1]).html(block[0]));
  }
});

function refreshTypeTable() {
  var block_id   = $("#type_block_select").val();

  $create_table.bootstrapTable('removeAll');
  $add_table.bootstrapTable('removeAll');
  $nickname_table.bootstrapTable('removeAll');
  $type_table.bootstrapTable('removeAll');

  socket.emit('client2server_group_refreshTypeTable', block_id);
};

socket.on('server2client_group_refreshTypeTable', function(deviceList) {
  for(i = 0; i < deviceList.length; i++) {
    var ep = deviceList[i].split('=');

    $type_table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        type_ep:       ep[0],
        type_nickname: ep[1],
        type_group:    ep[2],
        type_type:     ep[3],
        type_floor:    ep[4],
        type_power:    ep[5],
      }
    });
  }
});

function editType() {
  var devices = $type_table.bootstrapTable('getSelections');
  var type    = $("#lamp_type_select").val();
  var watt    = $("#lamp_watt").val();
  var epList = [];

  for(i = 0; i < devices.length; i++) {
    epList.push(devices[i]['type_ep']);
  }

  if (type.indexOf('SELECT') == -1) {
    socket.emit('client2server_group_editType', epList, type, watt);
  }

  $type_table.bootstrapTable('uncheckAll');
};

socket.on('server2client_group_editType', function(ep, type, watt) {
  $type_table.bootstrapTable('updateByUniqueId', {
    id: ep,
    row: {
      type_type:  type,
      type_power: watt
    }
  });
});

socket.on('server2client_group_editType_fail', function(epList) {
  alert('Error occurred when setting lamps type. ' + epList);
});

//////////////////////////////////////////////////////////////////////

$nickname_table.on('click-row.bs.table', function (e, row, $element) {
  $('#nickname_set_id').val(row['nickname_ep']);
  $('#nickname_set_name').val(row['nickname_name']);
  $('#nickname_set_watt').val(row['nickname_watt']);
});
