/**
 * Dragging logic
 */
import { _gc, _tapz } from "logic/gc";

let dragY,
  dragX = 0;
let hero, heroId, heroIndex, heroColumn, heroSlot, parent;
export const startDrag = (event) => {
  event.preventDefault();
  event.stopPropagation();

  dragY = event.screenY;
  dragX = event.screenX;

  hero = event.currentTarget;
  heroId = event.target.dataset.id;
  heroColumn = hero.dataset.column;
  heroSlot = hero.dataset.slot;

  _tapz[heroColumn].slots[heroSlot].forEach((e,i) => {
    if ( e.id.toString() === heroId ) {
      heroIndex = i;
    }
  });

  parent = hero.parentElement;
  hero.style.zIndex = '10';
  hero.style.pointerEvents = 'none';
  parent.style.userselect = 'none';

  window.addEventListener("mousemove", dragElement);
  window.addEventListener("mouseup", drop, { once: true });
};

let dragEntryOffsetY, dragEntryOffsetX;
const dragElement = (event) => {
  if (hero) {
    dragEntryOffsetY = event.screenY - dragY;
    dragEntryOffsetX = event.screenX - dragX;
    hero.style.transform = `translate3d(${dragEntryOffsetX}px,${dragEntryOffsetY}px,0)`;
  }
};

const drop = event => {
  event.preventDefault();
  event.stopPropagation();
  // console.log(event.target.dataset.column, event.target.dataset.slot, event.target.dataset.id);
  let targetId = event.target.dataset.id;
  let targetColumn = event.target.dataset.column;
  let targetSlot = event.target.dataset.slot;
  let willBeHero = event.target.dataset.hero;
  let targetIndex = null;
  
  if ( targetColumn && targetSlot ) {
    targetId && _tapz[targetColumn].slots[targetSlot].forEach((e,i) => {
      if ( e.id.toString() === targetId ) {
        targetIndex = i;
      }
    });

    if ( heroColumn === targetColumn && heroSlot === targetSlot && targetIndex === undefined ) {
      reset();
      return;
    }
    _tapz[targetColumn].slots[targetSlot] = _tapz[targetColumn].slots[targetSlot] || [];
    let heroData = _tapz[heroColumn].slots[heroSlot].splice(heroIndex, 1)[0];
    heroData.column = targetColumn;
    heroData.slot = targetSlot;
    heroData.hero = willBeHero;

    if ( willBeHero === 'true' && targetIndex !== null ) {
      let targetData = _tapz[targetColumn].slots[targetSlot].splice(targetIndex, 1)[0];
      targetData.column = 'Recent';
      targetData.slot = 1;
      targetData.hero = false;
      _tapz.Recent.slots[1].push(targetData);
    }
    

    targetIndex === null ? _tapz[targetColumn].slots[targetSlot].push(heroData)
      : _tapz[targetColumn].slots[targetSlot].splice(targetIndex, 0, heroData);

    _gc[targetColumn].dispatch();
    _gc[heroColumn].dispatch();
    _gc.Recent.dispatch();  
  }
  
  reset();
};

const reset = () => {
  hero.removeAttribute("style");
  parent.removeAttribute("style");
  window.removeEventListener("mousemove", dragElement);
}