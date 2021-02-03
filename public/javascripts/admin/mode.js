var $table  = $('#schedule_table');
const PROPERTY = $('#site_name').text();

$(function() {
  $table.bootstrapTable();
  schedule_refresh();
});

function schedule_refresh() {
  socket.emit('client2server_mode', PROPERTY);

  $table.bootstrapTable('removeAll');
}

function s1_display(v) {
  $('#s1_d').val(v + '%');
}

function s2_display(v) {
  $('#s2_d').val(v + '%');
}

function s3_display(v) {
  $('#s3_d').val(v + '%');
}

function s4_display(v) {
  $('#s4_d').val(v + '%');
}

function add_mode() {
  var s1_h = ($('#s1_hh').val());
  var s1_m = ($('#s1_mm').val());
  var s1_brightness = $('#s1').val();
  
  var s2_h = ($('#s2_hh').val());
  var s2_m = ($('#s2_mm').val());
  var s2_brightness = $('#s2').val();

  var s3_h = ($('#s3_hh').val());
  var s3_m = ($('#s3_mm').val());
  var s3_brightness = $('#s3').val();

  var s4_h = ($('#s4_hh').val());
  var s4_m = ($('#s4_mm').val());
  var s4_brightness = $('#s4').val();

  var s1 = s1_h + s1_m + s1_brightness;
  var s2 = s2_h + s2_m + s2_brightness;
  var s3 = s3_h + s3_m + s3_brightness;
  var s4 = s4_h + s4_m + s4_brightness;
  
  var name = $('#mode_name').val();
  var mode = s1 + s2 + s3 + s4;

  var slot1 = s1_h + s1_m;
  var slot2 = s2_h + s2_m;
  var slot3 = s3_h + s3_m;
  var slot4 = s4_h + s4_m;

  if ((slot1 != slot2) && (slot1 != slot3) && (slot1 != slot4) && 
      (slot2 != slot3) && (slot2 != slot4) && (slot3 != slot4)) {
        
    socket.emit('client2server_add_mode', name, mode, PROPERTY);
  } else {
    alert('Fail to create mode. Please input 4 different sessions!');
  }
}

function getLevel(s) {
  var lv = s.substring(4, 6);

  if (lv == 'a0') {
    return '100%';
  } else if (lv == '00') {
    return '0%';
  } else {
    return lv + '%';
  }
}

function getTime(s) {
  return s.substring(0, 2) + ':' + s.substring(2,4);
}

socket.on('server2client_mode', function(name, session, site, result) {
  if (result == 'success') {
    if (name != 'template_mode') {
      var s1 = session.substring(0, 6);
      var s2 = session.substring(6, 12);
      var s3 = session.substring(12, 18);
      var s4 = session.substring(18, 24);
  
      var btn_delete = '<button class="btn btn-danger btn-sm" value="' + name + '" onclick="deleteMode(this)" data-toggle="tooltip" data-placement="top" title="Delete this Dimming Profile"><span class="fas fa-trash"></span></button>';
  
      if (site == 'all') {
        btn_delete = '-';
      }
    
      $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
          delete:  btn_delete,
          mode:    name,
          s1_time: getTime(s1),
          s1_lv:   getLevel(s1),
          s2_time: getTime(s2),
          s2_lv:   getLevel(s2),
          s3_time: getTime(s3),
          s3_lv:   getLevel(s3),
          s4_time: getTime(s4),
          s4_lv:   getLevel(s4),
        }
      });
    }
  } else {
    alert('Mode: ' + name + ' cannot be created. Probably duplicate mode name.');
  }
});

function deleteMode(e) {
  var mode = e.value;

  var prompt_msg = 'Please enter the Dimming Schedule Name "' + mode + '" to confirm delete.';

  var confirmation = prompt(prompt_msg , '');

  if (confirmation == mode) {
    socket.emit('client2server_delete_mode', mode, PROPERTY);
  } else {
    alert('Input Name is wrong! Abort deletion.');
  }
}

socket.on('server2client_delete_mode', function(mode, result) {
  if (result == 'success') {
    $table.bootstrapTable('removeByUniqueId', mode);
  } else {
    alert('Dimming Schedule ' + mode + ' has error when delete.');
  }
});
