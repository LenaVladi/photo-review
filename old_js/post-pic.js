'use strict';

let checkImage = null;

/**
 * Функция отправляет новую картинку на сервер
 * @param {file} сразу первый эллемент масиива, так как мы только одну картинку отправляем в интерфейс приложения, файл полученный из e.target.files[0]
 */
function PostPic(file) {
  const data = new FormData();
  data.append('title', file.name);
  data.append('image', file);

  const xhr = new XMLHttpRequest();

  xhr.addEventListener('loadstart', () => loader.style.display = '');
  xhr.addEventListener('load', () => {
    hideElement(loader)
    pictureOn(file);
    hideElement(error);
    modeShare.setAttribute('data-state', 'selected');
  });

  xhr.open('post', 'https://neto-api.herokuapp.com/pic');
  xhr.send(data);
}

/**
 * Функция обработки файла или его отсутствие.
 * В случае успешной проверки - отправляет файл на сервер
 * @param {file} file файл полученный посредством dragndrop или загрузкой в приложение через input
 */

const fileProcessing = function (file) {
  if (validFile(file)) {
    hideElement(error);
    PostPic(file);
    //showElements(loader);
  } else {
    errorMessage.textContent = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.';
    showElement(error);
  }
};

/**
 * Принимает событие из drag&drop, из которого получает нужный файл, и отпрявляет его на проверку в функцию fileProcessing
 * @param {e} событие из которого будет извлечен файл (картинка)
 */
function onFilesDrop(e) {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  fileProcessing(file);

  if (!checkImage) {
    errorMessage.textContent = 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом «Загрузить новое» в меню';
    showElement(error);
    return;
  }
}

function createCanvas(image) {
  //инициализация тега canvas
  const canvas = document.createElement('canvas');
  canvas.classList.add('canvas');

  // wrapApp.insertBefore(canvas, error);
  imageWrap.insertBefore(canvas, currentImage);

  canvas.width = image.offsetWidth;
  canvas.height = image.offsetHeight;
}

/** вывод картинки на экран
 * @param {file} файл прошедший проверку на подходящий формат
 */
function pictureOn(file) {
  currentImage.src = URL.createObjectURL(file);
  currentImage.addEventListener('load', e => {
    URL.revokeObjectURL(e.target.src);
    // document.querySelector('.menu__url').value = window.location.href;
    createCanvas(currentImage);

    commentsForm.style.width = `${currentImage.width}px`;
    commentsForm.style.height = `${currentImage.height}px`;

    console.log(window.location.href)
    console.log(URL)
  });
}

/**
 * Проверяет формат файла, подходят только - (jpg, png).
 * @param {file} файл из e.target.files[0]
 * @return boolean
 */
function validFile(file) {
  const imageTypeREexp = /^image\/(jpeg|jpg|png)/;

  if (imageTypeREexp.test(file.type)) {
    return true;
  } else {
    return false;
  }
}

//подписка на событие input - получает картинку и отправляет её на сервер
const addImageInput = document.querySelector('input[type=file]');
addImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];

  fileProcessing(file);
});

// подписка на событие drag&drop картинки в окно браузера
wrapApp.addEventListener('dragover', event => {
  event.preventDefault();
});
wrapApp.addEventListener('drop', onFilesDrop);
