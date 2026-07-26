import { state, BAG, PAIR_BOX } from './state.js';
import { triggerMatchEffect, checkScreenCompletion } from './screens.js';

window.addEventListener('mousedown', e => {
  const mx = e.clientX;
  const my = e.clientY;
  state.mousePos = { x: mx, y: my };

  if (state.showingPairsOverlay || state.showingBagOverlay) {
    if (state.showingBagOverlay) {
      const startX = state.width / 2 - 175;
      const startY = state.height / 2 - 120;
      state.bagItems.forEach((item, i) => {
        const sx = startX + (i % 5) * 60 + 40;
        const sy = startY + Math.floor(i / 5) * 70 + 70;
        if (Math.hypot(mx - sx, my - sy) < 30) {
          item.x = mx;
          item.y = my;
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
  if (mx >= PAIR_BOX.x && mx <= PAIR_BOX.x + PAIR_BOX.w && my >= PAIR_BOX.y && my <= PAIR_BOX.y + PAIR_BOX.h) {
    state.showingPairsOverlay = true;
    return;
  }

  // Clicked Spare Bag
  if (mx >= BAG.x && mx <= BAG.x + BAG.w && my >= BAG.y && my <= BAG.y + BAG.h) {
    if (state.bagItems.length > 0) state.showingBagOverlay = true;
    return;
  }

  // Pickup top-most item
  for (let i = state.items.length - 1; i >= 0; i--) {
    if (state.items[i].isPointInside(mx, my)) {
      state.draggedItem = state.items[i];
      state.dragOffset.x = mx - state.draggedItem.x;
      state.dragOffset.y = my - state.draggedItem.y;
      state.items.splice(i, 1);
      state.items.push(state.draggedItem);
      break;
    }
  }
});

window.addEventListener('mousemove', e => {
  state.mousePos.x = e.clientX;
  state.mousePos.y = e.clientY;
});

window.addEventListener('mouseup', () => {
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
    if (target !== draggedItem && !target.isSpawining && Math.hypot(draggedItem.x - target.x, draggedItem.y - target.y) < 45) {
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
});
