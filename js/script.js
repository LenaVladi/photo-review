const mainInterface = document.querySelector('.menu'),
      menuItem = mainInterface.querySelectorAll('.menu__item'),
      image = document.querySelector('.current-image'),
      imageWrap = document.querySelector('.current-image-wrap'),
      app = document.querySelector('.app'),
      loader = document.querySelector('.image-loader'),
      error = document.querySelector('.error'),
      errorMessage = error.querySelector('.error__message'),
      mode = document.querySelectorAll('.menu__item.mode'),
      commentForm = document.querySelector('.comments__form'),
      shareUrl = document.querySelector('.menu__url'),
      menuToggle = document.querySelector('.menu__toggle-bg'),
      REST_API = 'https://neto-api.herokuapp.com';

let socket,
    commentForms,
    canvas,
    ctx;

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

function canvasDisabled(boolean) {
  const canvas = document.querySelector('.canvas');

  if (!canvas) { return; }

  if (boolean) {
    canvas.classList.add('disabled')
  } else {
    canvas.classList.remove('disabled')
  }
}

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
      canvasDisabled(false)
    }

    if (item.classList.contains('comments')) {
      commented(image.dataset.id);
      canvasDisabled(true)
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

  postImageInfo(file);
}

function postImageInfo(file) {
  fetch(`${REST_API}/pic`, {
    body: setFormData(file),
    credentials: 'same-origin',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
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
    .catch(er => {
      console.warn(er)
      errorMessage.textContent = 'Извините, сервер недоступен :(';
      hideElement(loader);
      showElement(error);
    });
}

function getImageInfo(id) {
  fetch(`${REST_API}/pic${id}`, {
    credentials: 'same-origin',
    method: 'GET'
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
      console.log(res)
    })
    .catch(er => {
      console.warn(er)
      errorMessage.textContent = 'Извините, сервер недоступен :(';
      hideElement(loader);
      showElement(error);
    });
}

function setFormData(file) {
  const formData = new FormData();
  formData.append('title', file.name);
  formData.append('image', file);
  return formData;
}

function createUrl() {
  shareUrl.value = window.location.href;
}

function showImage(res, element) {
  image.src = res.url;
  image.dataset.id = res.id;
  image.dataset.timestamp = res.timestamp;
  image.classList.remove('visually-hidden');

  image.addEventListener('load', event => {
    hideElement(loader);
    showMenu(element);

    let imageInfo = {
      imageSrc: image.src,
      imageId: image.dataset.id,
      imageTimestamp: image.dataset.timestamp
    }

    sessionStorage.setItem('ImageInfo', JSON.stringify(imageInfo));

    commentForm.style.width = `${image.width}px`;
    commentForm.style.height = `${image.height}px`;

    createUrl();
    socketInit();
  });
}

window.addEventListener('load', function () {
  let ImageInfo;

  if(sessionStorage.getItem('ImageInfo')) {
    ImageInfo = JSON.parse(sessionStorage.getItem('ImageInfo'))

    image.src = ImageInfo.imageSrc;
    image.dataset.id = ImageInfo.imageId;
    image.timestamp = ImageInfo.imageTimestamp;

    createCanvas();
    createUrl();
    socketInit();
    getImageInfo(image.dataset.id);
  }
});

// ======================= наброски ========================== //

// вот тут еще бы хотелось предусмотреть передачу колбека.. а если точнее передачу каких-то действий в случае успеха
function connectionPostApi(data, type) {
  let request = `/pic`,
    id = image.dataset.id;
  const REST_API = 'https://neto-api.herokuapp.com';
  const headers = {
    comment: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    pic: {
      'Content-Type': 'multipart/form-data'
    }
  }

  // added comments
  if (type === 'comments') {
    request += `/${id}/${type}`;
  }

  fetch(`${REST_API}${request}`, {
    body: data,
    credentials: 'same-origin',
    headers: type === 'pic' ? headers.pic : headers.comment,
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
      // вот здесь нужно как-то обработать событие в случае успеха. callback...
    })
    .catch(er => console.log(er));
}

function connectionGetApi() {
  fetch(`${REST_API}/pic/${id}`, {
    credentials: 'same-origin',
    method: 'GET'
  })
    .then(res => {
      if (200 <= res.status && res.status < 300) {
        return res;
      }
      throw new Error(response.statusText);
    })
    .then(res => res.json())
    .then(res => {
      // и здесь нужно как-то обработать событие в случае успеха. callback...
    })
    .catch(er => console.log(er));
}




