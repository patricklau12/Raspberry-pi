function debug_clear(element) {
  document.getElementById('debug_window').innerHTML = '';
}

socket.on('debug_show', function(payload) {
  document.getElementById('debug_window').innerHTML += '<br> ' + payload;
});
