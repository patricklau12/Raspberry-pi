const PROPERTY = $('#site_name').text();
const USERNAME = $('#user_name').text();

var $table     = $('#report_table');

$(function() {
  $table.bootstrapTable();
  socket.emit('client2server_user_home', PROPERTY, USERNAME, '');
  socket.emit('client2server_report_user', '');
});

socket.on('server2client_user_home', function(blockList, dummy1, dummy2) {
  for (i = 0; i < blockList.length; i++) {
    var maingateway = blockList[i].split('=');
    $("#block_select").append($('<option></option>').val(maingateway[0]).html(maingateway[1]));
  }
});

socket.on('server2client_report_user', function(recordList) {
  for(i = 0; i < recordList.length; i++) {
    $("#record_select").append($('<option></option>').val(recordList[i]).html(recordList[i]));
  }
});

function getReport() {
  var MGID   = $('#block_select').val();
  var type   = $('#type_select').val();
  var record = $('#record_select').val();

  $table.bootstrapTable('removeAll');

  if ((MGID.indexOf('SELECT') == -1) && (record.indexOf('SELECT') == -1)) {
    socket.emit('client2server_report_getReport', MGID, type, record);
  }
};

function download() {
  var type   = $('#type_select').val();
  var record = $('#record_select').val();

  if (type == 'func') {
    title = 'Monthly Functional Test Report on ' + record;
  } else {
    title = 'Annually Durational Test Report on ' + record;
  }

  var doc   = new jsPDF('l','mm','a4');

  var site  = 'Property: ' + PROPERTY;
  var block = 'Location: ' + $("#block_select option:selected").text();
  var date  = 'Print Date: ' + getDate();
  var title  = '';

  if (type == 'func') {
    title = 'Monthly Functional Test Report on ' + record;
  } else {
    title = 'Annually Durational Test Report on ' + record;
  }

  var print_title = PROPERTY + ' ' + block + ' ' + title + '.pdf';

  var img = new Image();
  img.src = '../images/Avanlite-Logo.jpg';

  doc.addImage(img, 'JPEG', 15, 10, 75, 13);
  doc.setFontSize(23);
  doc.setFontStyle('bold');
  doc.text('Smart Lighting Control System', 95, 22, 'left');
  doc.setFontSize(13);
  doc.setFontStyle('bold');
  doc.text(site, 15, 32, 'left');
  doc.setFontStyle('normal');
  doc.text(block, 15, 40, 'left');
  doc.setFontSize(13);
  doc.text(title, 15, 48, 'left');
  doc.setFontSize(12);
  doc.text(date, 220, 50, 'left');
  doc.line(14, 53, 283, 53);
  doc.setFontSize(10);
  doc.autoTable({startY: 55, html: '#report_table'});
  doc.autoTable({});
  doc.save(print_title);
};

socket.on('server2client_report_getReport', function(epTestList, type) {
  if(epTestList.length > 0 ) {
    for(i = 0; i < epTestList.length; i++) {
      var ep = epTestList[i].split('*');

      var watt = '';
      if ((ep[6] == '') || (ep[6] == undefined)){
        watt = '';
      } else {
        watt = displayWatt(ep[6]);
      }

      var time = '';
      if (type == 'func') {
        time = '1 min';
      } else {
        time = '2 hours';
      }
      
      $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
          device:        displayDevice(ep[0]),
          nickname:       ep[1],
          group:          ep[7],
          floor:          ep[2],
          type:           ep[3],
          watt:           watt,
          test_time:      ep[4],
          discharge_time: time,
          discharge_res:  getDischarge(ep[5]),
          test_res:       getResult(ep[5])
        }
      });
    }
  }
});
