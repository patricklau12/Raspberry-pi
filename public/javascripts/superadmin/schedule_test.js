var $table  = $('#test_table');

$(function() {
  $table.bootstrapTable();

  socket.emit('client2server_schedule_getProperty', '');
});

socket.on('server2client_schedule_getProperty', function(siteList) {
  for(i = 0; i < siteList.length; i++) {
      $("#site_select").append($('<option></option>').val(siteList[i]).html(siteList[i]));
  }
});

function refreshBlock() {
  var i = 0;
  var L = document.getElementById("block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("block_select").remove(i);
  }

  $table.bootstrapTable('removeAll');

  var site = $("#site_select").val();

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_schedule_refreshBlock', site);
  }
}

socket.on('server2client_schedule_getBlock', function(blockList) {
  for(i = 0; i < blockList.length; i++) {
    var block = blockList[i].split(',');
    $("#block_select").append($('<option></option>').val(block[1]).html(block[0]));
}
});

function refreshTable() {
  $table.bootstrapTable('removeAll');

  var block = $("#block_select").val();
  var site  = $("#site_select").val();

  if (block.indexOf('SELECT') == -1) {
    socket.emit('client2server_schedule_refreshTable', block, site);
  }
}

socket.on('server2client_schedule_getTable', function(groupList) {
  for(i = 0; i < groupList.length; i++) {
    var group = groupList[i].split(',');

    $table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        group:           group[0],
        num:             group[8],
        func_test_day:   group[1],
        func_test_time:  displayTime(group[2]) + ':' + displayTime(group[3]),
        dura_test_month: group[4],
        dura_test_day:   group[5],
        dura_test_time:  displayTime(group[6]) + ':' + displayTime(group[7]),
      }
    });
  }
});

function setSchedule() {
  var group    = $("#group_name").val();

  var func_day = $("#func_day").val();
  var func_hh  = $("#func_hh").val();
  var func_mm  = $("#func_mm").val();

  var dura_mon = $("#dura_mon").val();
  var dura_day = $("#dura_day").val();
  var dura_hh  = $("#dura_hh").val();
  var dura_mm  = $("#dura_mm").val();

  socket.emit('client2server_schedule_setTest', group, func_day, func_hh, func_mm, dura_mon, dura_day, dura_hh, dura_mm);
}

socket.on('server2client_schedule_setTest', function(test, result) {
  var group = test.split('=');

  if (result == 'success') {
    $table.bootstrapTable('updateByUniqueId', {
      id: group[0],
      row: {
        func_test_day:   group[1],
        func_test_time:  displayTime(group[2]) + ':' + displayTime(group[3]),
        dura_test_month: group[4],
        dura_test_day:   group[5],
        dura_test_time:  displayTime(group[6]) + ':' + displayTime(group[7]),
      }
    });

  } else {
    alert('Group:' + group[0] + ' has error when update.');
  }
});

$table.on('click-row.bs.table', function (e, row, $element) {
  $('#group_name').val(row['group']);
});