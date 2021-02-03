var $table = $('#imagetable');

$(function() {
  $table.bootstrapTable();

  socket.emit('client2server_file', '');
});

socket.on('server2client_file', function(imageList) {
  for(i = 0; i < imageList.length; i++) {
    var btn_delete = '<button class="btn btn-danger btn-sm" value="'  + imageList[i] + '" onclick="deleteImage(this)" data-toggle="tooltip" data-placement="top" title="Delete this Image"><span class="fas fa-trash"></span></button>';
    var btn_view   = '<button class="btn btn-primary btn-sm" value="' + imageList[i] + '" onclick="viewImage(this)" data-toggle="tooltip" data-placement="top" title="View Image"><span class="fas fa-eye"></span></button>';

    $table.bootstrapTable('insertRow', {
      index: 1,
      row: {
        delete: btn_delete,
        view:   btn_view,
        image:  imageList[i]
      }
    });
  }
});

function deleteImage(e) {
  var image = e.value;
  $('#imagepreview').attr("src","/uploads/" + image);

  var prompt_msg = 'Please enter the Image Filename "' + image + '" to confirm delete.';

  var confirmation = prompt(prompt_msg , '');

  if (confirmation == image) {
    socket.emit('client2server_file_delete', image);
  } else {
    alert('Input filename is wrong! Abort deletion.');
  }
};

function viewImage(e) {
  var image = e.value;
  $('#imagepreview').attr("src","/uploads/" + image);
};

socket.on('server2client_file_delete', function(image, result) {
  if (result == 'success') {
    $table.bootstrapTable('removeByUniqueId', image);
  } else {
    alert('Erro deleting image file.');
  }
});

$table.on('click-row.bs.table', function (e, row, $element) {
  var img = row['image'];
  $('#imagepreview').attr("src", "/uploads/" + img);
});
