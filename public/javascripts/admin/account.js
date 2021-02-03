var $user_table = $('#user_table');
var $bic_table  = $('#bic_table');

const PROPERTY = $('#site_name').text();
var User = [];

$('#myTab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

$(function() {
  $user_table.bootstrapTable();
  $bic_table.bootstrapTable({disableUnusedSelectOptions: true});
  
  $('#create_user').show();
  $('#update_user').hide();

  socket.emit('client2server_account_admin', PROPERTY);
  getBlock();
});

socket.on('server2client_account_admin', function (userList) {
  for (i = 0; i < userList.length; i++) {
    var user = userList[i].split('=');
    User.push(user[0]);

    var tick = '<button class="btn btn-danger btn-sm" value="' + user[0] + '" onclick="deleteUser(this)"  data-toggle="tooltip" data-placement="top" title="Delete"><span class="fas fa-trash"></span></button>';

    $user_table.bootstrapTable('insertRow', {
      index: 0,
      row: {
        action: tick,
        user_id: user[0],
        user_name: user[1],
        bic: user[4],
      }
    });
  }
});

//////////////////////////////////////////////////////////////////////

function saveUser() {
  var id   = $('#user_id').val();
  var name = $("#user_name").val();
  var pw   = $("#user_password").val();
  var site = PROPERTY;

  if ((id.length < 1) || (name.length < 1) || (pw.length  < 1)) {

    var message = 'Please fill in all information!'
    alert(message);

  } else {
    socket.emit('client2server_account_saveUser', id, name, pw, site);
  }
};

socket.on('server2client_create_account', function (userid, username, bic) {
  var tick = '<button class="btn btn-danger btn-sm" id="' + userid + '" onclick="deleteUser(this)"  data-toggle="tooltip" data-placement="top" title="Delete"><span class="fas fa-trash"></span></button>';

  $user_table.bootstrapTable('insertRow', {
    index: 0,
    row: {
      action:    tick,
      user_id:   userid,
      user_name: username,
      bic:       bic,
    }
  });

  User.push(userid);
});

function updateUser(e) {
  var id   = $('#user_id').val();
  var name = $("#user_name").val();
  var pw   = $("#user_password").val();
  var site = $("#user_site").val();

  if ((id.length < 1) || (name.length < 1) || (pw.length < 1) || (site.length < 1)) {
    var message = 'Please fill in all information!'
    alert(message);

  } else {
    socket.emit('client2server_account_updateAdmin', id, name, pw, site);
  }
};

function checkUserID(e) {
  if (User.indexOf(e.value) != -1) {
    $('#create_user').hide();
    $('#update_user').show();

  } else {
    $('#create_user').show();
    $('#update_user').hide();
  }
};

socket.on('server2client_update_admin', function(id, result, name, site) {
  if (result == 'success') {
    $user_table.bootstrapTable('updateByUniqueId', {
      id: id,
      row: {
        user_name: name,
        site: site
      }
    });
  } else {
    alert('User (ID:' + id + ' has error when update.');
  }
});

//////////////////////////////////////////////////////////////////////

function getBlock() {
  var site = PROPERTY;

  var i = 0;
  var L = document.getElementById("bic_user").options.length - 1;
  
  for(i = L; i >= 1; i--) {
      document.getElementById("bic_user").remove(i);
  }

  $bic_table.bootstrapTable('removeAll');
  socket.emit('client2server_get_block', site, 'noneed');
};

socket.on('server2client_account_bic', function (blockList, userList, updateUser, userBIC) {
  for (i = 0; i < blockList.length; i++) {
    var block = blockList[i].split('=');

    $bic_table.bootstrapTable('insertRow', {
      index: 0,
      row: {
        block: block[0],
        mgid:  block[1],
        user:  block[2]
      }
    });
  }

  if (updateUser != 'noneed') {
    var user = updateUser.split('=');

    $user_table.bootstrapTable('updateByUniqueId', {
      id: user[0],
      row: {
        bic: user[1]
      }
    });
  } else {
    for (i = 0; i < userBIC.length; i++) {
      $("#bic_user").append($('<option></option>').val(userBIC[i]).html(userBIC[i]));
    }
  }
});

function addUser2Location() {
  var user = $("#bic_user").val();

  var bic_list = $bic_table.bootstrapTable('getSelections');
  var bicList  = [];

  for (i = 0; i < bic_list.length; i++) {
    bicList.push(bic_list[i]["block"]);
  }

  socket.emit('client2server_authorize_user', user, bicList);
  $type_table.bootstrapTable('uncheckAll');
};

socket.on('server2client_authorize_user', function (user, result) {
  if (result == 'success') {
    var site = PROPERTY;
    
    $bic_table.bootstrapTable('removeAll');
    socket.emit('client2server_get_block', site, user);

  } else {
    alert('User (ID:' + user + ' has error when authorize locations.');
  }
});

//////////////////////////////////////////////////////////////////////

function deleteUser(element) {
  var userid = element.value;

  var prompt_msg = 'Please enter the User ID "' + userid + '" to confirm delete.';
  var confirmation = prompt(prompt_msg , '');

  if (confirmation == userid) {
    socket.emit('client2server_account_delete', userid);
  } else {
    alert('Input ID is wrong! Abort deletion.');
  }
};

socket.on('server2client_delete_account', function(userid, result) {
  if (result == 'success') {
    $user_table.bootstrapTable('removeByUniqueId', userid);

  } else {
    alert('User (user ID:' + userid + ') has error when delete.');
  }
});

//////////////////////////////////////////////////////////////////////

$user_table.on('click-row.bs.table', function (e, row, $element) {
  $('#user_id').val(row['user_id']);
  $("#user_name").val(row['user_name']);

  $('#create_user').hide();
  $('#update_user').show();
});

//////////////////////////VALIDATION CHECK////////////////////////////////
var myInput1 = document.getElementById("user_password");
var letter1 = document.getElementById("letter1");
var capital1 = document.getElementById("capital1");
var number1 = document.getElementById("number1");
var length1 = document.getElementById("length1");

// When the user clicks on the password field, show the message box
myInput1.onfocus = function () {
  document.getElementById('usermessage').style.display = 'block';
}

// When the user clicks outside of the password field, hide the message box
myInput1.onblur = function () {
  document.getElementById('usermessage').style.display = 'none';
}

// When the user starts to type something inside the password field
myInput1.onkeyup = function () {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if (myInput1.value.match(lowerCaseLetters)) {
    letter1.classList.remove("invalid");
    letter1.classList.add("valid");
  } else {
    letter1.classList.remove("valid");
    letter1.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if (myInput1.value.match(upperCaseLetters)) {
    capital1.classList.remove("invalid");
    capital1.classList.add("valid");
  } else {
    capital1.classList.remove("valid");
    capital1.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if (myInput1.value.match(numbers)) {
    number1.classList.remove("invalid");
    number1.classList.add("valid");
  } else {
    number1.classList.remove("valid");
    number1.classList.add("invalid");
  }

  // Validate length
  if (myInput1.value.length >= 12) {
    length1.classList.remove("invalid");
    length1.classList.add("valid");
  } else {
    length1.classList.remove("valid");
    length1.classList.add("invalid");
  }
}