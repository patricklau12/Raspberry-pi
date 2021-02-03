var $table     = $('#dim_table');
const PROPERTY = $('#site_name').text();

$(function() {
  $table.bootstrapTable();
  refreshBlock();
});

function refreshBlock() {
  var i = 0;
  var L = document.getElementById("block_select").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("block_select").remove(i);
  }

  var i = 0;
  var L = document.getElementById("modeA").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("modeA").remove(i);
      document.getElementById("modeB").remove(i);
      document.getElementById("modeC").remove(i);
      document.getElementById("modeD").remove(i);
      document.getElementById("modeE").remove(i);
      document.getElementById("modeF").remove(i);
  }

  $table.bootstrapTable('removeAll');
  socket.emit('client2server_dimming_refreshBlock', PROPERTY);
}

socket.on('server2client_dimming_getBlock', function(blockList, modeList) {
  for(i = 0; i < blockList.length; i++) {
    var block = blockList[i].split('=');

    $("#block_select").append($('<option></option>').val(block[1]).html(block[0]));
  }

  var existing = [];

  $("#modeA option").each(function() { 
      existing.push($(this).val());
  });

  for(i = 0; i < modeList.length; i++) {
    if (existing.indexOf(modeList[i]) == -1) {
      $("#modeA").append($('<option></option>').val(modeList[i]).html(modeList[i]));
      $("#modeB").append($('<option></option>').val(modeList[i]).html(modeList[i]));
      $("#modeC").append($('<option></option>').val(modeList[i]).html(modeList[i]));
      $("#modeD").append($('<option></option>').val(modeList[i]).html(modeList[i]));
      $("#modeE").append($('<option></option>').val(modeList[i]).html(modeList[i]));
      $("#modeF").append($('<option></option>').val(modeList[i]).html(modeList[i]));
    }
  }
});

function refreshTable() {
  var block = $("#block_select").val();

  $table.bootstrapTable('removeAll');
  socket.emit('client2server_dimming_refreshTable', block, PROPERTY);
}

socket.on('server2client_dimming_getTable', function(groupList) {
  for(i = 0; i < groupList.length; i++) {
    var group = groupList[i].split('=');

    $table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        group: group[0],
        num:   group[7],
        a:     group[1],
        b:     group[2],
        c:     group[3],
        d:     group[4],
        e:     group[5],
        f:     group[6]
      }
    });
  }
});

function setDimming() {
  var group = $("#group_name").val();
  var block = $("#block_select").val();

  var modeA = $("#modeA").val();
  var modeB = $("#modeB").val();
  var modeC = $("#modeC").val();
  var modeD = $("#modeD").val();
  var modeE = $("#modeE").val();
  var modeF = $("#modeF").val();

  socket.emit('client2server_dimming_set', group, PROPERTY, block, modeA, modeB, modeC, modeD, modeE, modeF);
}

socket.on('server2client_dimming_set', function(dim, result) {
  var group = dim.split('=');

  if (result == 'success') {
    $table.bootstrapTable('updateByUniqueId', {
      id: group[0],
      row: {
        a:     group[1],
        b:     group[2],
        c:     group[3],
        d:     group[4],
        e:     group[5],
        f:     group[6]
      }
    });

  } else {
    alert('Group:' + group[0] + ' has error when update.');
  }
});

$table.on('click-row.bs.table', function (e, row, $element) {
  $('#group_name').val(row['group']);
});