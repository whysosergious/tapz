/**
 * Dragging logic
 */
import { _gc, _tapz, handleRecent, writeData } from "logic/gc";

let dragY,
  dragX = 0;
let hero, heroId, heroIndex, heroColumn, heroSlot, parent;
let dragging = false;
export const startDrag = (event) => {
  event.preventDefault();
  event.stopPropagation();

  let pos = /(?:mouse)/g.test(event.type) ? event : event.touches[0];

  dragY = pos.screenY;
  dragX = pos.screenX;

  hero = event.target;
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

  if ( /(?:mouse)/g.test(event.type) ) {
    window.addEventListener("mousemove", dragElement);
    window.addEventListener("mouseup", drop, { once: true, passive: true });
  } else {
    window.addEventListener("touchmove", dragElement, { passive: false, cancellable: true });
    window.addEventListener("touchend", drop, { once: true, passive: true });
    window.addEventListener("touchcancel", reset, { once: true });
  }
};

let dragEntryOffsetY, dragEntryOffsetX;
const dragElement = (event) => {
  event.preventDefault();
  let pos = /(?:mouse)/g.test(event.type) ? event : event.touches[0];
  if (hero) {
    dragEntryOffsetY = pos.screenY - dragY;
    dragEntryOffsetX = pos.screenX - dragX;
    hero.style.transform = `translate3d(${dragEntryOffsetX}px,${dragEntryOffsetY}px,0)`;

    if (dragEntryOffsetY >= 10 || dragEntryOffsetY <= -10 || dragEntryOffsetX >= 10 || dragEntryOffsetX <= -10)
      dragging = true;
    else
      dragging = false;
  }
};

const drop = event => {
  event.stopPropagation();

  let pos = /(?:mouse)/g.test(event.type) ? event : event.changedTouches[0];
  let target = /(?:mouse)/g.test(event.type) ? event.target : document.elementFromPoint(
    pos.pageX,
    pos.pageY
  );

  let targetId = target.dataset.id;
  let targetColumn = target.dataset.column;
  let targetSlot = target.dataset.slot;
  let willBeHero = target.dataset.hero;
  let targetIndex = null;
  let slotCheck = !targetId || /(?:Bench)|(?:Recent)/g.test(targetColumn) || 
    _tapz[targetColumn].slots[targetSlot].length < 4 || 
    (heroColumn === targetColumn && heroSlot === targetSlot);

  if ( targetColumn && targetSlot && dragging && slotCheck) {
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
      handleRecent(targetColumn, targetSlot, targetIndex);
    }
    
    targetIndex === null ? _tapz[targetColumn].slots[targetSlot].push(heroData)
      : _tapz[targetColumn].slots[targetSlot].splice(targetIndex, 0, heroData);
    
    _gc[targetColumn].dispatch();
    _gc[heroColumn].dispatch();
    // save on every rerender ( user action )
    writeData(_tapz);
  }
  
  reset();
};

const reset = () => {
  hero.removeAttribute("style");
  parent.removeAttribute("style");
  window.removeEventListener("mousemove", dragElement, { passive: true });
  window.removeEventListener("touchmove", dragElement, { passive: true });
  dragging = false;
}