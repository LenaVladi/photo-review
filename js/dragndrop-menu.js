'use strict';

// ------------------ Drag&drop mainInterface --------------- //
const drag = document.querySelector('.drag');

let mouseOffset = {
  x : 0,
  y : 0
};

let isMouseDown = false;
let maxX = app.offsetLeft, // границы экрана
    maxY = app.offsetTop; // границы экрана
let minX, minY;
let shiftX, shiftY; // смещение

/**
 * Начало drag&drop
 * @param {event}  событие из которого вычисляет координаты елемента
 * @param {elem}  в данном случае елемент "меню"
 */

function dragStart(event, elem) {
  isMouseDown = true;

  shiftX = event.pageX - elem.offsetLeft - window.pageXOffset;
  shiftY = event.pageY - elem.offsetTop - window.pageYOffset;

  minX = maxX + app.offsetWidth - elem.offsetWidth;
  minY = maxY + app.offsetHeight - elem.offsetHeight;
}

/**
 * Движение drag&drop
 * @param {event} событие из которого вычисляет координаты елемента и мышки
 * @param {elem}  в данном случае елемент "меню"
 */

function drags(event, elem) {
  event.preventDefault();

  if (isMouseDown) {

    let mouseOffset = {
      x : event.clientX - shiftX,
      y : event.clientY - shiftY
    };

    //left top
    mouseOffset.x = Math.min(mouseOffset.x, minX);
    mouseOffset.y = Math.min(mouseOffset.y, minY);
    //bottom right
    mouseOffset.x = Math.max(mouseOffset.x, maxX) - 1; // -1px - это хак, чтобы меню не разваливалось у правого края
    mouseOffset.y = Math.max(mouseOffset.y, maxY);

    elem.style.left = mouseOffset.x + 'px';
    elem.style.top = mouseOffset.y + 'px';
  }
}

/**
 * Завершение drag&drop
 */

function drop() {
  isMouseDown = null;
}

// подписка на события для drag&drop меню (drag - "корешок" меню)
drag.addEventListener('mousedown', event => {
  dragStart(event, mainInterface);
  window.addEventListener('mousemove', event => { drags(event, mainInterface); });
  window.addEventListener('mouseup', event => {
    event.preventDefault();
    drop(event, mainInterface); });
});
