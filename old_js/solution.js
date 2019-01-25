'use strict';

const menu = document.querySelector('.menu'),
      menuItem = document.querySelectorAll('.menu__item'),
      burger = document.querySelector('.burger'),
      modeNew = document.querySelector('.mode.new'),
      modeComments = document.querySelector('.mode.comments'),
      modeDraw = document.querySelector('.mode.draw'),
      modeShare = document.querySelector('.mode.share'),
      toolsComments = document.querySelector('.comments-tools'),
      toolsShare = document.querySelector('.share-tools'),
      currentImage = document.querySelector('.current-image'),
      imageWrap = document.querySelector('.current-image-wrap'),
      error = document.querySelector('.error'),
      errorMessage = document.querySelector('.error__message'),
      loader = document.querySelector('.image-loader'),
      commentsForm = document.querySelector('.comments__form'),
      wrapApp = document.querySelector('.wrap.app'),
      menuColor = document.querySelectorAll("input.menu__color");


// --------------------- Универсальные функции показа/скрытия элемента ------------------------- //

const showElement = function (elem) {
  elem.style.display = '';
};

const hideElement = function (elem) {
  elem.style.display = 'none';
};
// ------------------- Дефолтное отображение приложения ------------------ //


function DefaultInterface() {
  menu.dataset.state = 'initial';
  currentImage.src = '';
  hideElement(commentsForm);
}

DefaultInterface();

/**
 * Функция создает input для загрузки фотографии в приложение
 * @return {html-tag} Возвращает input спрятанный под блоком "Загрузить новое", обернутый в label
 */

function createInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'file';
  input.name = 'new-image';
  input.accept = 'image/jpeg, image/png';
  input.style.display = 'none';

  const label = document.createElement('label');
  label.setAttribute('for', 'file');
  label.style.display = 'inline-block';
  label.style.position = 'absolute';
  label.style.top = '0';
  label.style.left = '0';
  label.style.width = '13rem';
  label.style.height = '6.3rem';

  label.appendChild(input);
  mode.querySelector('.now').appendChild(label);
}

createInput();

/**
 * Функция запрашивает информацию о картинке
 * @param {} event
 */
function GetPicInfo(event, data) {
  const id = data.id;

  fetch(`https://neto-api.herokuapp.com/pic/${id}`, {
    credentials: 'some-origin',
    method: 'GET',
    headers: 'Content-Type: application/json'
  })
    .then(res => res.text())
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

/**
 * Функция добавляет новый комментарий и обновляет ленту комментариев
 * @param {} event
 */
function SetComment(event) {
  let form = new Form();

  fetch(`https://neto-api.herokuapp.com/pic/${id}/comments`, {
    body: JSON.stringify({
      title: "",
      image: toBlob("")
    }),
    credentials: 'some-origin',
    method: 'POST',
    headers: 'Content-Type: application/json'
  })
    .then(res => console.log(JSON.parse(res)))
    .catch(err => console.log(err));
}
