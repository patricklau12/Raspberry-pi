var $table_site  = $('#site_table');
var $table_block = $('#block_table');
var $table_floor = $('#floor_table');

var Property = [];

$(function() {
  $table_site.bootstrapTable();
  $table_block.bootstrapTable();
  $table_floor.bootstrapTable();
  
  socket.emit('client2server_block_ping', '');
  socket.emit('client2server_site', '');

  $('#create_profile').show();
  $('#update_profile').hide();

  $('#bind_mg').show();
  $('#update_mg').hide();

  $('#MG_list').show();
  $('label[for=MG_list]').show();
  $('#MG_list_update').hide();
  $('label[for=MG_list_update]').hide();
});

$('#myTab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

//////////////////////////////////////////////////////////////////////

socket.on('server2client_site', function(imageList, siteList, blockList, mgList) {
  $table_site.bootstrapTable('removeAll');
  $table_block.bootstrapTable('removeAll');
  $table_floor.bootstrapTable('removeAll');

  if(imageList.length > 0) {
    for(i = 0; i < imageList.length; i++) {
      $("#site_avatar").append($('<option></option>').val(imageList[i]).html(imageList[i]));
      $("#floorplan_img").append($('<option></option>').val(imageList[i]).html(imageList[i]));
    }
  }

  if(siteList.length > 0 ) {
    for(i = 0; i < siteList.length; i++) {
      var site = siteList[i].split('=');

      var btn_delete1 = '<button class="btn btn-danger btn-sm" value="'  + site[6] + '" onclick="deleteProperty(this)" data-toggle="tooltip" data-placement="top" title="Delete this Property Profile"><span class="fas fa-trash"></span></button>';
      var btn_view    = '<button class="btn btn-primary btn-sm" value="' + site[8] + '" onclick="viewAvatar(this)" data-toggle="tooltip" data-placement="top" title="View Property Avatar"><span class="fas fa-eye"></span></button>';

      $table_site.bootstrapTable('insertRow', {
        index: 1,
        row: {
          site_delete:  btn_delete1,
          site_name:    site[0],
          site_person:  site[1],
          site_contact: site[2],
          site_email:   site[3],
          site_date:    site[4],
          site_status:  site[5],
          site_code:    site[6],
          site_address: site[7],
          site_view:    btn_view,
          site_avatar:  site[8]
        }
      });

      $("#site_list").append($('<option></option>').val(site[0]).html(site[0]));
      $("#MG_property").append($('<option></option>').val(site[0]).html(site[0]));

      Property.push(site[6]);
    }
  }

  if(blockList.length > 0 ) {
    for(i = 0; i < blockList.length; i++) {
      var block = blockList[i].split('=');

      var btn_delete2 = '<button class="btn btn-danger btn-sm" value="' + block[1] + '" onclick="deleteBlock(this)" data-toggle="tooltip" data-placement="top" title="Delete this Location"><span class="fas fa-trash"></span></button>';

      $table_block.bootstrapTable('insertRow', {
        index: 1,
        row: {
          block_delete: btn_delete2,
          block_name:   block[0],
          block_mg:     block[1],
          block_prop:   block[2],
        }
      });
    }
  }
  
  if(mgList.length > 0) {
    for(i = 0; i < mgList.length; i++) {
        $("#MG_list").append($('<option></option>').val(mgList[i]).html(mgList[i]));
    }
  }
});

function viewAvatar(e) {
  var image = e.value;

  $('#avatarpreview').attr("src","/uploads/" + image);
  $('#imgModal').modal('show');
};

function createSite() {
  var code    = $('#site_code').val();
  var name    = $('#site_name').val();
  var person  = $('#site_person').val();
  var contact = $('#site_contact').val();
  var email   = $('#site_email').val();
  var address = $('#site_address').val();
  var avatar  = $('#site_avatar').val();

  if ((code.length < 1) || (name.length    < 1) || (person.length  < 1) || (contact.length < 1)
  || (email.length < 1) || (address.length < 1) || (avatar.length  < 1)) {

    var message = 'Please fill in all information!'
    alert(message);

  } else {
    socket.emit('client2server_create_site', code, name, person, contact, email, address, avatar);
    $table_block.bootstrapTable('removeAll');
  }
};

function UpdateSite() {
  var code    = $('#site_code').val();
  var name    = $('#site_name').val();
  var person  = $('#site_person').val();
  var contact = $('#site_contact').val();
  var email   = $('#site_email').val();
  var address = $('#site_address').val();
  var avatar  = $('#site_avatar').val();

  var old      = $table_site.bootstrapTable('getRowByUniqueId', code);
  var old_name = old["site_name"];

  if ((code.length < 1) || (name.length    < 1) || (person.length  < 1) || (contact.length < 1)
  || (email.length < 1) || (address.length < 1) || (avatar.length  < 1)) {

    var message = 'Please fill in all information!'
    alert(message);

  } else {
    socket.emit('client2server_update_site', code, name, person, contact, email, address, avatar, old_name);
    $table_block.bootstrapTable('removeAll');
  }
};

function checkCODE(e) {
  if (Property.indexOf(e.value) != -1) {
    $('#create_profile').hide();
    $('#update_profile').show();

  } else {
    $('#create_profile').show();
    $('#update_profile').hide();
  }
}

function deleteProperty(e) {
  var code = e.value;

  var prompt_msg = 'Please enter the property code "' + code + '" to confirm delete.';

  var confirmation = prompt(prompt_msg , '');

  if (confirmation == code) {
    socket.emit('client2server_delete_site', code);
    $table_block.bootstrapTable('removeAll');
  } else {
    alert('Input Code is wrong! Abort deletion.');
  }
}

socket.on('server2client_delete_site', function(code, result) {
  if (result == 'success') {
    $table_site.bootstrapTable('removeByUniqueId', code);

    var L = document.getElementById("site_list").options.length - 1;
    
    for(i = L; i >= 1; i--) {
        document.getElementById("site_list").remove(i);
        document.getElementById("MG_property").remove(i);
    }

    setTimeout(function() {
      var rows = $table_site.bootstrapTable('getData');

      for(j=0; j < rows.length; j++) {
        $("#site_list").append($('<option></option>').val(rows[j]["site_name"]).html(rows[j]["site_name"]));
        $("#MG_property").append($('<option></option>').val(rows[j]["site_name"]).html(rows[j]["site_name"]));
      }
    }, 500);
  } else {
    alert('Property (Code ID:' + code + ') has error when delete.');
  }
});

socket.on('server2client_update_site', function(code, result, name, person, contact, email, address, avatar) {
  if (result == 'success') {
    var btn_view = '<button class="btn btn-primary btn-sm" value="' + avatar + '" onclick="viewAvatar(this)" data-toggle="tooltip" data-placement="top" title="View Property Avatar"><span class="fas fa-eye"></span></button>';

    $table_site.bootstrapTable('updateByUniqueId', {
      id: code,
      row: {
        site_name:    name,
        site_person:  person,
        site_contact: contact,
        site_email:   email,
        site_code:    code,
        site_address: address,
        site_avatar:  avatar,
        site_view:    btn_view
      }
    });

    var L = document.getElementById("site_list").options.length - 1;
    
    for(i = L; i >= 1; i--) {
        document.getElementById("site_list").remove(i);
        document.getElementById("MG_property").remove(i);
    }

    setTimeout(function() {
      var rows = $table_site.bootstrapTable('getData');

      for(j=0; j < rows.length; j++) {
        $("#site_list").append($('<option></option>').val(rows[j]["site_name"]).html(rows[j]["site_name"]));
        $("#MG_property").append($('<option></option>').val(rows[j]["site_name"]).html(rows[j]["site_name"]));
      }
    }, 500);
  } else {
    alert('Property (Code ID:' + code + 'has error when update.');
  }
});

socket.on('server2client_create_site', function(code, result, site, manager, contact, email, start_date, status, address, avatar) {
  if (result == 'success') {
    var btn_delete = '<button class="btn btn-danger btn-sm" value="'  + code + '" onclick="deleteProperty(this)" data-toggle="tooltip" data-placement="top" title="Delete this Property Profile"><span class="fas fa-trash"></span></button>';
    var btn_view   = '<button class="btn btn-primary btn-sm" value="' + avatar + '" onclick="viewAvatar(this)" data-toggle="tooltip" data-placement="top" title="View Property Avatar"><span class="fas fa-eye"></span></button>';

    $table_site.bootstrapTable('insertRow', {
      index: 1,
      row: {
        site_delete:  btn_delete,
        site_code:    code,
        site_name:    site,
        site_person:  manager,
        site_contact: contact,
        site_email:   email,
        site_date:    start_date,
        site_status:  status,
        site_address: address,
        site_view:    btn_view,
        site_avatar:  avatar
      }
    });

    $("#site_list").append($('<option></option>').val(site).html(site));
    $("#MG_property").append($('<option></option>').val(site).html(site));

  } else {
    var message = 'Cannot Create Profile! Please confirm the information.'
    alert(message);
  }
});

//////////////////////////////////////////////////////////////////////

function bindMG() {
  var block = $('#block').val();
  var mgid  = $("#MG_list").val();
  var prop  = $("#MG_property").val();

  if ((prop.indexOf('SELECT') == -1) && (mgid.indexOf('SELECT') == -1) &&(block != '')) {
    socket.emit('client2server_create_block', block, mgid, prop);
  }
};

socket.on('server2client_create_block', function(block, mgid, prop, mgList, result) {
  switch (result) {
    case 'success':
      var btn_delete2 = '<button class="btn btn-danger btn-sm" value="' + mgid + '" onclick="deleteBlock(this)" data-toggle="tooltip" data-placement="top" title="Delete this Location"><span class="fas fa-trash"></span></button>';

      $table_block.bootstrapTable('insertRow', {
        index: 1,
        row: {
          block_delete: btn_delete2,
          block_name: block,
          block_mg:   mgid,
          block_prop: prop
        }
      });

      var L = document.getElementById("MG_list").options.length - 1;
      
      for(i = L; i >= 1; i--) {
          document.getElementById("MG_list").remove(i);
      }

      for(j = 0; j < mgList.length; j++) {
        $("#MG_list").append($('<option></option>').val(mgList[j]).html(mgList[j]));
      }
      break;

    case 'duplicate':
      alert('Location Name Duplicated! Please confirm all information.');
      break;

    default:
      alert('Cannot create Location! Please confirm all information.');
      break;
  }
});

function deleteBlock(e) {
  var mgid = e.value;

  var prompt_msg = 'Please enter the location ID "' + mgid + '" to confirm delete.';

  var confirmation = prompt(prompt_msg , '');

  if (confirmation == mgid) {
    var block = $table_block.bootstrapTable('getRowByUniqueId', mgid);
    var name  = block["block_name"];

    socket.emit('client2server_delete_block', mgid, name);
  } else {
    alert('Input ID is wrong! Abort deletion.');
  }
};

socket.on('server2client_delete_block', function(mgid, result) {
  if (result == 'success') {
    $table_block.bootstrapTable('removeByUniqueId', mgid);
    $("#MG_list").append($('<option></option>').val(mgid).html(mgid));
    
  } else {
    alert('Location (ID:' + mgid + ') has error when delete.');
  }
});

function updateMG() {
  var block = $('#block').val();
  var mgid  = $("#MG_list_update").val();
  var prop  = $("#MG_property").val();

  var old_row  = $table_block.bootstrapTable('getRowByUniqueId', mgid);
  var old_name = old_row["block_name"];
  var old_prop = old_row["block_prop"];

  socket.emit('client2server_update_block', block, mgid, prop, old_name, old_prop);
}

socket.on('server2client_update_block', function(mgid, block, prop, result) {
  switch (result) {
    case 'success':
      $table_block.bootstrapTable('updateByUniqueId', {
        id: mgid,
        row: {
          block_name: block,
          block_prop: prop
        }
      });
  
      cancelupdateMG();
      break;

    case 'duplicate':
      alert('Location (ID:' + mgid + ') Name Duplicated with other locations in Property (' + prop + ')');
      break;

    default:
      alert('Location (ID:' + mgid + ') has error when update.');
      break;
  }
});

function cancelupdateMG() {
  $('#block').val('');
  $("#MG_list_update").val('');
  $("#MG_property").val('SELECT');

  $('#bind_mg').show();
  $('#update_mg').hide();

  $('#MG_list').show();
  $('label[for=MG_list]').show();
  $('#MG_list_update').hide();
  $('label[for=MG_list_update]').hide();
}

//////////////////////////////////////////////////////////////////////

function changePreview() {
  var image = $("#floorplan_img").val();

  if (image != '/images/default_image.png') {
    $('#imagepreview').attr("src", "/uploads/" + image);
  } else {
    $('#imagepreview').attr("src", "/images/default_image.png");
  }
};

function addBlock() {
  var i = 0;
  var L = document.getElementById("block_list").options.length - 1;
  
  for(i = L; i >= 1; i--) {
    document.getElementById("block_list").remove(i);
  }

  $table_floor.bootstrapTable('removeAll');

  var site = $("#site_list").val();

  if (site.indexOf('SELECT') == -1) {
    socket.emit('client2server_add_block', site);
  }
};

socket.on('server2client_add_block', function(blockList, mapList) {
  var existing1 = [];

  $("#block_list option").each(function() {
      existing1.push($(this).val());
  });

  for(i = 0; i < blockList.length; i++) {
    if (existing1.indexOf(blockList[i]) == -1) {
      $("#block_list").append($('<option></option>').val(blockList[i]).html(blockList[i]));
    }
  }

  if (mapList.length > 0) {
    for(i = 0; i < mapList.length; i++) {
      var map = mapList[i].split(',');

      var btn_delete = '<button class="btn btn-danger btn-sm" value="' + map[0] + '" onclick="deleteMap(this)" data-toggle="tooltip" data-placement="top" title="Delete this Floorplan"><span class="fas fa-trash"></span></button>';

      $table_floor.bootstrapTable('insertRow', {
        index: 1,
        row: {
          floor_delete: btn_delete,
          floor_name:   map[0],
          floor_site:   map[1],
          floor_block:  map[2],
          floor_img:    map[3]
        }
      });
    }
  }
});

//////////////////////////////////////////////////////////////////////

function addFloor() {
  var name  = $("#floor_name").val();
  var site  = $("#site_list").val();
  var img   = $("#floorplan_img").val();
  var block = $("#block_list").val();

  if ((img.indexOf('/images/default_image.png') == -1) && (block.indexOf('SELECT') == -1) && (site.indexOf('SELECT') == -1)) {
    socket.emit('client2server_map_floor', name, site, img, block);
  }
};

function deleteMap(e) {
  var map   = e.value;

  var map_data = $table_floor.bootstrapTable('getRowByUniqueId', map);

  var prompt_msg = 'Please enter the Floorplan Name "' + map + '" to confirm delete.';

  var confirmation = prompt(prompt_msg , '');

  if (confirmation == map) {
    socket.emit('client2server_delete_floorplan', map, map_data["floor_site"], map_data["floor_block"]);
  } else {
    alert('Input ID is wrong! Abort deletion.');
  }
};

socket.on('server2client_create_map_error', function(dummy) {
  var message = 'Cannot Create Fllor Map! Please confirm the information.'
  alert(message);
});

socket.on('server2client_map_floor', function(name, site, img, block) {
  var btn_delete = '<button class="btn btn-danger btn-sm" value="' + name + '" onclick="deleteMap(this)" data-toggle="tooltip" data-placement="top" title="Delete this Floorplan"><span class="fas fa-trash"></span></button>';

  $table_floor.bootstrapTable('insertRow', {
    index: 1,
    row: {
      floor_delete: btn_delete,
      floor_name:  name,
      floor_site:  site,
      floor_block: block,
      floor_img:   img
    }
  });
});

socket.on('server2client_delete_floorplan', function(name, result) {
  if (result == 'success') {
    $table_floor.bootstrapTable('removeByUniqueId', name);

  } else {
    alert('Floorplan (Name:' + name + ') has error when delete.');
  }
});

//////////////////////////////////////////////////////////////////////

socket.on('server2client_refresh_location_table', function(locationList) {
  $table_block.bootstrapTable('removeAll');

  for(i = 0; i < locationList.length; i++) {
    var block = locationList[i].split('=');
  
    var btn_delete = '<button class="btn btn-danger btn-sm" value="' + block[1] + '" onclick="deleteBlock(this)" data-toggle="tooltip" data-placement="top" title="Delete this Location"><span class="fas fa-trash"></span></button>';
  
    $table_block.bootstrapTable('insertRow', {
      index: 1,
      row: {
        block_delete: btn_delete,
        block_name:   block[0],
        block_mg:     block[1],
        block_prop:   block[2],
      }
    });
  }
});

$table_site.on('click-row.bs.table', function (e, row, $element) {
  $('#site_code').val(row['site_code']);
  $('#site_name').val(row['site_name']);
  $('#site_person').val(row['site_person']);
  $('#site_contact').val(row['site_contact']);
  $('#site_email').val(row['site_email']);
  $('#site_address').val(row['site_address']);
  $('#site_avatar').val(row['site_avatar']);

  $('#create_profile').hide();
  $('#update_profile').show();
});

$table_block.on('click-row.bs.table', function (e, row, $element) {
  $('#bind_mg').hide();
  $('#update_mg').show();

  $('#MG_list').hide();
  $('label[for=MG_list]').hide();
  $('#MG_list_update').show();
  $('label[for=MG_list_update]').show();
  
  $('#MG_property').val(row['block_prop']);
  $('#block').val(row['block_name']);
  $('#MG_list_update').val(row['block_mg']);
});