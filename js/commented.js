function commented(id) {
  console.log(id);
  showElement(commentForm);

  var socket = new WebSocket(`wss://neto-api.herokuapp.com/pic/${id}`);

  socket.onopen = function() {
    console.warn("Соединение установлено.");
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.warn('Соединение закрыто чисто');
    } else {
      console.error('Обрыв соединения');
    }
    console.error('Код: ' + event.code + ' причина: ' + event.reason);
  };

  socket.onmessage = function(event) {
    console.warn("Получены данные " + event.data);
  };

  socket.onerror = function(error) {
    console.error("Ошибка " + error.message);
  };
}

menuToggle.addEventListener('click', function (el) {
  if (el.target.id === 'comments-off') {
    hideElement(commentForm);
  } else {
    showElement(commentForm);
  }
});

