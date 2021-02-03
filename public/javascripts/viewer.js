var male     = 'available';
var female_a = 'available';
var female_b = 'available';
var nursery  = 'available';

socket.on('viewer', function(dest, content) {
  console.log('Receive message from Sensor #' + dest + ' , Content: ' + content);

  switch (dest) {
    case 'dest_male1':
      var result       = -1;

      if (content == 'in-use') {
        male = 'in-use';
        result = 0;
      } else {
        male = 'available';
        result = 1;
      }

      if (male == 'in-use') {
        $('#male').css("color", "LightSalmon");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>1</span>"
        document.getElementById("male").innerHTML = display;

      } else {
        $('#male').css("color", "MediumSpringGreen");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>1</span>"
        document.getElementById("male").innerHTML = display;
      }
      break;

    case 'dest_female_a':
      var result = -1;

      if (content == 'in-use') {
        female_a = 'in-use';
      } else {
        female_a = 'available';
      }

      if ((female_a == 'in-use') && (female_b == 'in-use')) {
        result = 0;
      } else if ((female_a == 'in-use') && (female_b == 'available')) {
        result = 1;
      } else if ((female_a == 'available') && (female_b == 'in-use')) {
        result = 1;
      } else {
        result = 2;
      }

      if (result == 0) {
        $('#female').css("color", "LightSalmon");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>2</span>"
        document.getElementById("female").innerHTML = display;

      } else {
        $('#female').css("color", "MediumSpringGreen");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>2</span>"
        document.getElementById("female").innerHTML = display;
      }
      break;

    case 'dest_female_b':
      var result = -1;

      if (content == 'in-use') {
        female_b = 'in-use';
      } else {
        female_b = 'available';
      }

      if ((female_a == 'in-use') && (female_b == 'in-use')) {
        result = 0;
      } else if ((female_a == 'in-use') && (female_b == 'available')) {
        result = 1;
      } else if ((female_a == 'available') && (female_b == 'in-use')) {
        result = 1;
      } else {
        result = 2;
      }

      if (result == 0) {
        $('#female').css("color", "LightSalmon");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>2</span>"
        document.getElementById("female").innerHTML = display;

      } else {
        $('#female').css("color", "MediumSpringGreen");
        var display = result + "<span style='font-size:40px; color:White'>&thinsp;/</span><span style='font-size:35px; color:White'>2</span>"
        document.getElementById("female").innerHTML = display;
      }
      break;

    case 'dest_nursery':
      nursery = content;

      if (nursery == 'in-use') {
        document.getElementById("nursery").src = 'toilet/changing-room2.png';
      } else {
        document.getElementById("nursery").src = 'toilet/changing-room.png';
      }
      break;

    case 'dest_temperature':
      var display = content + "<span style='font-size:30px; color:White'>&thinsp;&#8451;</span>"
      document.getElementById("temperature").innerHTML = display;
      break;

    case 'dest_humidity':
      var display = content + "<span style='font-size:30px; color:White'>&thinsp;%</span>"
      document.getElementById("humidity").innerHTML = display;
      break;

    case 'dest_airquality':
      $('#airquality').text(content);

      if (content == 'Good') {
        $('#airquality').css("color", "MediumSpringGreen");
      } else {
        $('#airquality').css("color", "MediumSpringGreen");
      }
      break;
  }
});
