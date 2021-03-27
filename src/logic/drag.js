/**
 * Dragging logic
 */
import { _gc } from "logic/gc";

let dragY,
  dragX = 0;
let hero, heroIndex, heroColumn, targetIndex, targetColumn, columns;
export const startDrag = (event) => {
  dragY = event.screenY;
  dragX = event.screenX;

  hero = event.currentTarget;
  heroColumn = hero.dataset.column;
  let heroKey = hero.dataset.key;
  columns || (columns = hero.parentElement.parentElement.children);
  hero.style.zIndex = "10";
  hero.style.pointerEvents = "none";

  _gc[heroColumn].cards.forEach((c, i) => {
    if (c.stamp === heroKey) {
      heroIndex = i;
    }
  });

  Object.values(columns).forEach((column) => {
    column.style.userSelect = "none";
    Object.values(column.children).forEach((card) => {
      if (card) {
        card.addEventListener("mouseover", dragOver);
        card.addEventListener("mouseout", cancelDrop);
      }
    });
  });
  window.addEventListener("mousemove", dragElement);
  window.addEventListener("mouseup", drop);
};

let dragEntryOffsetY, dragEntryOffsetX;
const dragElement = (event) => {
  if (hero) {
    dragEntryOffsetY = event.screenY - dragY;
    dragEntryOffsetX = event.screenX - dragX;
    hero.style.transform = `translate3d(${dragEntryOffsetX}px,${dragEntryOffsetY}px,0)`;
  }
};

const dragOver = (event) => {
  targetColumn = event.currentTarget.dataset.column;

  let targetCard = event.currentTarget.dataset.key;

  targetIndex = targetCard === "last" ? _gc[targetColumn].cards.length : 0;

  _gc[targetColumn].cards.forEach((card, i) => {
    if (card.stamp === targetCard) {
      targetIndex = i;
      targetColumn = card.column;
      // console.log( targetColumn, targetIndex );
    }
  });
};

const cancelDrop = () => {
  targetColumn = targetIndex = null;
};

const drop = () => {
  if (targetColumn && targetIndex !== null) {
    let heroComp = _gc[heroColumn].cards.splice(heroIndex, 1)[0];

    heroComp.column = targetColumn;
    if (_gc[targetColumn].cards.length > 0) {
      _gc[targetColumn].cards.splice(targetIndex, 0, heroComp);
    } else {
      _gc[targetColumn].cards.push(heroComp);
    }
    _gc[heroColumn].dispatch();
    _gc[targetColumn].dispatch();
  }

  hero.removeAttribute("style");
  Object.values(columns).forEach((column) => {
    column.removeAttribute("style");
    Object.values(column.children).forEach((card) => {
      if (card) {
        card.removeEventListener("mouseover", dragOver);
        card.removeEventListener("mouseout", cancelDrop);
      }
    });
  });
  window.removeEventListener("mousemove", dragElement);
  window.removeEventListener("mouseup", drop);
  targetColumn = targetIndex = null;
};
