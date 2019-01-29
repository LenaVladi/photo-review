const mainInterface = document.querySelector('.menu');
const menuItem = mainInterface.querySelectorAll('.menu__item');
const image = document.querySelector('.current-image');
const imageWrap = document.querySelector('.current-image-wrap');
const app = document.querySelector('.app');
const loader = document.querySelector('.image-loader');
const error = document.querySelector('.error');
const errorMessage = error.querySelector('.error__message');
const mode = document.querySelectorAll('.menu__item.mode');
const commentForm = document.querySelector('.comments__form');
const shareUrl = document.querySelector('.menu__url');
const menuToggle = document.querySelector('.menu__toggle-bg')
let socket;
let commentForms;
let canvas, ctx;

// показ / скрытие элементов

function showElement(el) {
  el.style.display = '';
}

function hideElement(el) {
  el.style.display = 'none';
}

// стартовое состояние программы

function getDefaultInterface() {
  mainInterface.dataset.state = 'initial';
  image.src = '';
  image.classList.add('visually-hidden');
  hideElement(error);
  hideElement(commentForm);
}

getDefaultInterface();

// ---------------- create input ------------------ //
// создание инпута для загрузки изображения

function createInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'file';
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
  document.querySelector('.mode.new').appendChild(label);
}

createInput();

// ---------------- menu ------------------ //

function showMenu(elem) {
  mainInterface.dataset.state = 'selected';
  menuItem.forEach(item => item.dataset.state = '');
  document.querySelector(`.menu__item.${elem}`).dataset.state = 'selected';
}

// переключение между режимами
mode.forEach(item => {
  item.addEventListener('click', event => {
    if (item.classList.contains('new')) return;
    showMenu(item.classList[item.classList.length - 1]);

    if (item.classList.contains('draw')) {
      draw();
    }

    if (item.classList.contains('comments')) {
      commented(image.dataset.id);
    }
  });
});

// нажатие на бургер
document.querySelector('.menu__item.burger').addEventListener('click', event => {
  menuItem.forEach(item => item.dataset.state = '');
  mainInterface.dataset.state = 'default';
});

// изображение

let checkImage = null;

document.querySelector('#file').addEventListener('change', getImageFromInput);

function getImageFromInput(event) {
  const [files] = event.target.files;
  updateFilesInfo(files);
}

app.addEventListener('dragover', event => {
  event.preventDefault();
  checkImage = image.classList.contains('visually-hidden');
});

app.addEventListener('drop', onDrop);

function onDrop() {
  event.preventDefault();
  if (!checkImage) {
    errorMessage.textContent = 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом «Загрузить новое» в меню';
    showElement(error);
    return;
  } else {
    const files = event.dataTransfer.files[0];
    updateFilesInfo(files);
  }
}

function checkFileType(file) {
  const imageTypeRexp = /^image\/(jpeg|jpg|png)/;

  if (imageTypeRexp.test(file.type)) {
    return true;
  } else {
    return false;
  }
}

function updateFilesInfo(file) {
  if (checkFileType(file)) {
    hideElement(error);
    showElement(loader);
  } else {
    errorMessage.textContent = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.';
    showElement(error);
  }

  connectionImage(file);
}

function connectionImage(file) {
  fetch('https://neto-api.herokuapp.com/pic', {
    body: getFormData(file),
    credentials: 'same-origin',
    method: 'POST'
  })
    .then(res => {
      if (200 <= res.status && res.status < 300) {
        return res;
      }
      throw new Error(response.statusText);
    })
    .then(res => res.json())
    .then(res => {
      showImage(res, 'share');
    })
    .catch(er => console.log(er));
}

function getFormData(file) {
  const formData = new FormData();
  formData.append('title', file.name);
  formData.append('image', file);
  return formData;
}

function showImage(res, element) {
  // res.id
  // res.timestamp
  // res.url
  // res.title

  image.src = res.url;
  image.dataset.id = res.id;
  // createUrl(image.dataset.id);
  image.classList.remove('visually-hidden');
  image.addEventListener('load', event => {
    hideElement(loader);
    showMenu(element);

    sessionStorage.setItem('UploadImage', image.src);
    sessionStorage.setItem('ImageId', image.dataset.id);

    commentForm.style.width = `${image.width}px`;
    commentForm.style.height = `${image.height}px`;

    shareUrl.value = window.location.href;
  });
}

window.addEventListener('load', function () {
  if(sessionStorage.getItem('UploadImage')) {
    image.src = sessionStorage.getItem('UploadImage');

    if (image.onload && !canvas) {
      createCanvas();
    }
  }

  if(sessionStorage.getItem('ImageId')) {
    image.dataset.id = sessionStorage.getItem('ImageId');
  }
});

// ================================================= //

// const BRUSH_RADIUS = 4;
// let drawing = false;
// let color = "#6cbe47";
//
// function getColor(el) {
//   switch (el) {
//     case "red":
//       ctx.fillStyle = "#ea5d56";
//       break;
//     case "yellow":
//       ctx.fillStyle = "#f3d135";
//       break;
//     case "green":
//       ctx.fillStyle = "#6cbe47";
//       break;
//     case "blue":
//       ctx.fillStyle = "#53a7f5";
//       break;
//     case "purple":
//       ctx.fillStyle = "#b36ade";
//       break;
//   }
// }
//
// for (colors of menuColor) {
//   colors.addEventListener("click", (e) => {
//     getColor(e.target.value);
//   });
// }
//
// function makePoint(x, y) {
//   return [x, y];
// };
//
// canvas.addEventListener('mousdown', function (evt) {
//   drawing = true;
//   ctx.beginPath();
// }
// canvas.addEventListener('mousup', function (evt) {
//   drawing = false;
// }
//
// canvas.addEventListener('mousmove', function (evt) {
//   if (drawing) {
//     ctx.lineWidth = BRUSH_RADIUS * 2;
//     ctx.lineTo(evt.offsetX, evt.offsetY);
//     ctx.stroke();
//
//     ctx.beginPath();
//     ctx.arc(evt.offsetX, evt.offsetY, BRUSH_RADIUS / 2, 0, 2 * Math.PI);
//     ctx.fill();
//
//     ctx.beginPath();
//     ctx.moveTo(evt.offsetX, evt.offsetY);
//   }
// })
//
// document.addEventListener('keydown', function (evt) {
//   if (evt.keyCode === 90 && evt.keyCode === 91) {
//
//   }
// })





