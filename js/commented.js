commentForm.addEventListener('click', function (e) {
  if (e.target.classList.contains('.comments__submit')) {
    e.preventDefault();


  }
});

function commented(id) {
  showElement(commentForm);

}


function setFormComment(massage, left, top) {
  const formComment = {
    message: massage || '',
    left: left || '',
    top: top || ''
  };
  return formComment;
}

function postCommentsInfo(data, id) {
  //message — текст комментария, строка.
  //left — расстояние по горизонтальной оси X от левого края изображения, число;
  //top — расстояние по вертикальной оси Y от верхнего края изображения, число.

  fetch(`${REST_API}/${id}/comments`, {
    body: data,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
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

    })
    .catch(er => console.warn(er));
}

menuToggle.addEventListener('click', function (el) {
  if (el.target.id === 'comments-off') {
    hideElement(commentForm);
  } else {
    showElement(commentForm);
  }
});

image.addEventListener('click', (e) => {
  if (mainInterface.querySelector('.comments').dataset.state === 'selected') {
    console.log(setFormComment('', e.offsetX, e.offsetY))
  }
})

