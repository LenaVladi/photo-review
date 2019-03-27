function parseComment(data) {
  // "id": "-L5lSlx4chCJMqo36iLe",
  // "left": 313,
  // "message": "Вот тут можно добавить цифру 777",
  // "timestamp": 1519100829532,
  // "top": 298

  let newComment = document.querySelector(`.comment[data-id='${data.id}']`);

  commentForm.style.left = `${data.left}px`;
  commentForm.style.top = `${data.top}px`;

  let commentTime = document.querySelector(`.comment[data-id='${data.id}'] .comment__time`);
  let commentMessage = document.querySelector(`.comment[data-id='${data.id}'] .comment__message`);

  commentTime.textContent = data.timestamp.toLocaleString('ru');
  commentMessage.textContent = data.message;


}

function parseMask(data) {

}

function socketInit() {
  var socket = new WebSocket(`wss://neto-api.herokuapp.com/pic/${image.dataset.id}`);

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
