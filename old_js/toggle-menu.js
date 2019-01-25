
'use strict';

/**
 * Функция переключает пункты плавающего меню
 * @param {event} событие по которому будет идендифицирован пункт меню, которому будет добавлен нужный data аттрибут
 */

function ToggleMenu(event) {
  let element;

  if(event.srcElement.nodeName === 'LI') {
    element = event.target;
  } else {
    element = event.target.parentElement;
  }

  const mode = document.querySelectorAll('.menu__item.mode');

  //открывает все меню
  if (element === burger) {
    mode.forEach(el => el.setAttribute('data-state', ''));
    menu.setAttribute('data-state', 'default');
  }

  //открывает меню загрузки нового фото
  if (element === modeNew) {
    menu.setAttribute('data-state', 'initial');
  }

  //открывает подменю пунктов
  if (element.hasAttribute('data-state')) {
    if(element !== wrapApp) {
      mode.forEach(el => el.setAttribute('data-state', ''));
      element.setAttribute('data-state', 'selected');
      menu.setAttribute('data-state', 'selected');
    }
  }
}

menuItem.forEach(el => el.addEventListener('click', ToggleMenu));
