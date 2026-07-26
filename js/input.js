import { state, BAG, PAIR_BOX, ITEM_SCALE, getBagOverlayBox } from './state.js';
import { triggerMatchEffect, checkScreenCompletion } from './screens.js';

// Bigger fingers need bigger tap/drop targets than a mouse cursor does.
const BAG_ITEM_TAP_RADIUS = 30 * ITEM_SCALE;
const MATCH_DISTANCE = 45 * ITEM_SCALE;

function pointerDown(px, py) {
  state.mousePos = { x: px, y: py };

  if (state.showingPairsOverlay || state.showingBagOverlay) {
    if (state.showingBagOverlay) {
      const { x: startX, y: startY } = getBagOverlayBox();
      state.bagItems.forEach((item, i) => {
        const sx = startX + (i % 5) * 60 + 40;
        const sy = startY + Math.floor(i / 5) * 70 + 70;
        if (Math.hypot(px - sx, py - sy) < BAG_ITEM_TAP_RADIUS) {
          item.x = px;
          item.y = py;
          item.isSpawining = false;
          state.items.push(item);
          state.bagItems.splice(i, 1);
          state.showingBagOverlay = false;
        }
      });
    }

    state.showingPairsOverlay = false;
    state.showingBagOverlay = false;
    return;
  }

  // Clicked Paired Box
  if (px >= PAIR_BOX.x && px <= PAIR_BOX.x + PAIR_BOX.w && py >= PAIR_BOX.y && py <= PAIR_BOX.y + PAIR_BOX.h) {
    state.showingPairsOverlay = true;
    return;
  }

  // Clicked Spare Bag
  if (px >= BAG.x && px <= BAG.x + BAG.w && py >= BAG.y && py <= BAG.y + BAG.h) {
    if (state.bagItems.length > 0) state.showingBagOverlay = true;
    return;
  }

  // Pickup top-most item
  for (let i = state.items.length - 1; i >= 0; i--) {
    if (state.items[i].isPointInside(px, py)) {
      state.draggedItem = state.items[i];
      state.dragOffset.x = px - state.draggedItem.x;
      state.dragOffset.y = py - state.draggedItem.y;
      state.items.splice(i, 1);
      state.items.push(state.draggedItem);
      break;
    }
  }
}

function pointerMove(px, py) {
  state.mousePos.x = px;
  state.mousePos.y = py;
}

function pointerUp() {
  const draggedItem = state.draggedItem;
  if (!draggedItem) return;

  // Drop in bag
  if (draggedItem.x >= BAG.x && draggedItem.x <= BAG.x + BAG.w &&
      draggedItem.y >= BAG.y && draggedItem.y <= BAG.y + BAG.h) {
    state.bagItems.push(draggedItem);
    state.items = state.items.filter(i => i !== draggedItem);
    state.draggedItem = null;
    checkScreenCompletion();
    return;
  }

  // Check collision with other items
  for (let i = 0; i < state.items.length; i++) {
    const target = state.items[i];
    if (target !== draggedItem && !target.isSpawining && Math.hypot(draggedItem.x - target.x, draggedItem.y - target.y) < MATCH_DISTANCE) {
      if (draggedItem.matches(target)) {
        state.pairedCount++;
        state.matchedPairs.push(draggedItem);
        triggerMatchEffect(draggedItem, target);

        state.items = state.items.filter(i => i !== draggedItem && i !== target);
        state.draggedItem = null;
        checkScreenCompletion();
        return;
      }
    }
  }

  state.draggedItem = null;
}

window.addEventListener('mousedown', e => pointerDown(e.clientX, e.clientY));
window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
window.addEventListener('mouseup', () => pointerUp());

// Touch support: mirror the mouse handlers off the first touch point.
// preventDefault stops the page from scrolling/zooming while dragging.
window.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  if (touch) pointerDown(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener('touchmove', e => {
  e.preventDefault();
  const touch = e.touches[0];
  if (touch) pointerMove(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener('touchend', e => {
  e.preventDefault();
  pointerUp();
}, { passive: false });
