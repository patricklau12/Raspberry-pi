const PROPERTY  = $('#site_name').text();
const USERNAME  = $('#user_name').text();

var $dura_table = $('#dura_table');

$(function() {
  $dura_table.bootstrapTable();
  socket.emit('client2server_user_home', PROPERTY, USERNAME, '');
});

socket.on('server2client_user_home', function(blockList, dummy1, dummy2) {
  for (i = 0; i < blockList.length; i++) {
    var maingateway = blockList[i].split('=');
    $("#block_select").append($('<option></option>').val(maingateway[0]).html(maingateway[1]));
  }
});

function getReport() {
  var MGID  = $('#block_select').val();

  $dura_table.bootstrapTable('removeAll');

  if (MGID.indexOf('SELECT') == -1) {
    socket.emit('client2server_report_dura', MGID);
  }
};

function download() {
  var doc   = new jsPDF('l','mm','a4');

  var site  = 'Property: ' + PROPERTY;
  var block = 'Location: ' + $("#block_select option:selected").text();
  var date  = 'Print Date: ' + getDate();
  var title = 'Durational Test Report ';

  var print_title = PROPERTY + ' ' + block + ' - Durational Test Report.pdf';

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
  doc.autoTable({startY: 55, html: '#dura_table'});
  doc.autoTable({});
  doc.save(print_title);
};

socket.on('server2client_report_dura', function(epTestList) {
  if(epTestList.length > 0 ) {
    for(i = 0; i < epTestList.length; i++) {
      var ep = epTestList[i].split('*');

      var watt = '';
      if (ep[6] == '') {
        watt = '';
      } else {
        watt = displayWatt(ep[6]);
      }
      
      $dura_table.bootstrapTable('insertRow', {
        index: 1,
        row: {
          dura_devices:        displayDevice(ep[0]),
          dura_nickname:       ep[1],
          dura_group:          ep[7],
          dura_floor:          ep[2],
          dura_type:           ep[3],
          dura_watt:           watt,
          dura_test_time:      ep[4],
          dura_discharge_time: '2 hours',
          dura_discharge_res:  getDischarge(ep[5]),
          dura_test_res:       getResult(ep[5])
        }
      });
    }
  }
});
