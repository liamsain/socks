import { ctx, state, BAG, PAIR_BOX, BASKET } from './state.js';
import { ITEM_CLASSES } from './items.js';

function drawBagGraphic(x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);

  // Main bag body
  ctx.fillStyle = '#8e44ad';
  ctx.strokeStyle = '#5b2c6f';
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.25);
  ctx.bezierCurveTo(w * 0.1, h * 0.35, 0, h * 0.6, 0, h * 0.85);
  ctx.bezierCurveTo(0, h + 10, w, h + 10, w, h * 0.85);
  ctx.bezierCurveTo(w, h * 0.6, w * 0.9, h * 0.35, w * 0.7, h * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fold lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.25, h * 0.5);
  ctx.bezierCurveTo(w * 0.3, h * 0.7, w * 0.35, h * 0.85, w * 0.45, h * 0.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w * 0.75, h * 0.5);
  ctx.bezierCurveTo(w * 0.7, h * 0.7, w * 0.65, h * 0.85, w * 0.55, h * 0.9);
  ctx.stroke();

  // Drawstring neck
  ctx.fillStyle = '#d4ac0d';
  ctx.fillRect(w * 0.28, h * 0.22, w * 0.44, 8);

  // Hanging drawstring ends
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.4, h * 0.25);
  ctx.lineTo(w * 0.35, h * 0.45);
  ctx.moveTo(w * 0.6, h * 0.25);
  ctx.lineTo(w * 0.65, h * 0.45);
  ctx.stroke();

  // Bag ruffled top
  ctx.fillStyle = '#9b59b6';
  ctx.strokeStyle = '#5b2c6f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.22);
  ctx.lineTo(w * 0.15, 0);
  ctx.lineTo(w * 0.38, h * 0.1);
  ctx.lineTo(w * 0.5, 0);
  ctx.lineTo(w * 0.62, h * 0.1);
  ctx.lineTo(w * 0.85, 0);
  ctx.lineTo(w * 0.7, h * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SPARE BAG', w / 2, h * 0.62);
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#f1c40f';
  ctx.fillText(`(${state.bagItems.length} items)`, w / 2, h * 0.78);
  ctx.textAlign = 'left';

  ctx.restore();
}

function drawBasket() {
  ctx.fillStyle = '#d35400';
  ctx.beginPath();
  ctx.moveTo(BASKET.x, BASKET.y);
  ctx.lineTo(BASKET.x + BASKET.w, BASKET.y);
  ctx.lineTo(BASKET.x + BASKET.w - 15, BASKET.y + BASKET.h);
  ctx.lineTo(BASKET.x + 15, BASKET.y + BASKET.h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#a04000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Basket weave lines
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  for (let i = 15; i < BASKET.h; i += 18) {
    ctx.beginPath();
    ctx.moveTo(BASKET.x + 5, BASKET.y + i);
    ctx.lineTo(BASKET.x + BASKET.w - 5, BASKET.y + i);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('LAUNDRY', BASKET.x + 25, BASKET.y + BASKET.h / 2 + 4);
}

function drawGroundItems() {
  state.items.forEach(item => {
    item.updateSpawn();
    if (item.delayFrames === 0) {
      item.draw(ctx);
    }
  });
}

function drawParticles() {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    state.particles[i].update();
    state.particles[i].draw(ctx);
    if (state.particles[i].alpha <= 0) state.particles.splice(i, 1);
  }
}

function drawFlyingItems() {
  for (let i = state.flyingItems.length - 1; i >= 0; i--) {
    state.flyingItems[i].draw(ctx);
    if (state.flyingItems[i].update()) state.flyingItems.splice(i, 1);
  }
}

// Cached so it isn't re-randomized (e.g. Shoe's left/right foot) on
// every single frame; only rebuilt when the screen's item type changes.
let cachedIcon = null;
let cachedIconType = null;

function getPairCounterIcon() {
  if (cachedIconType !== state.itemType) {
    const IconClass = ITEM_CLASSES[state.itemType];
    cachedIcon = new IconClass(-1, '#e74c3c', 'striped', 0, 0);
    cachedIcon.isSpawining = false;
    cachedIconType = state.itemType;
  }
  return cachedIcon;
}

function drawPairCounter() {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 3;
  ctx.fillRect(PAIR_BOX.x, PAIR_BOX.y, PAIR_BOX.w, PAIR_BOX.h);
  ctx.strokeRect(PAIR_BOX.x, PAIR_BOX.y, PAIR_BOX.w, PAIR_BOX.h);

  getPairCounterIcon().draw(ctx, PAIR_BOX.x + 28, PAIR_BOX.y + 25, 0.35, -0.2);

  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Pairs: ${state.pairedCount}`, PAIR_BOX.x + 55, PAIR_BOX.y + 33);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#7f8c8d';
  ctx.fillText('Click to view all', PAIR_BOX.x + 55, PAIR_BOX.y + 46);
}

function drawScreenTitle() {
  // ctx.fillStyle = '#34495e';
  // ctx.font = '16px sans-serif';
  // ctx.fillText(`Screen ${state.currentScreen}: Pair socks or store odd ones in the bag!`, 20, 40);
}

function drawBagOverlay() {
  if (!state.showingBagOverlay) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, state.width, state.height);

  const startX = state.width / 2 - 175;
  const startY = state.height / 2 - 120;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX, startY, 350, 240);
  ctx.strokeStyle = '#2c3e50';
  ctx.strokeRect(startX, startY, 350, 240);

  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Spare Bag (Click an item to pull it out)', startX + 15, startY + 30);

  state.bagItems.forEach((item, i) => {
    const sx = startX + (i % 5) * 60 + 40;
    const sy = startY + Math.floor(i / 5) * 70 + 70;
    item.draw(ctx, sx, sy, 0.6, 0);
  });
}

function drawPairsOverlay() {
  if (!state.showingPairsOverlay) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, state.width, state.height);

  const startX = state.width / 2 - 200;
  const startY = state.height / 2 - 150;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX, startY, 400, 300);
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 3;
  ctx.strokeRect(startX, startY, 400, 300);

  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Matched Pairs Archive', startX + 20, startY + 35);

  if (state.matchedPairs.length === 0) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#7f8c8d';
    ctx.fillText('No pairs completed yet!', startX + 20, startY + 80);
  } else {
    state.matchedPairs.forEach((item, i) => {
      const sx = startX + (i % 4) * 90 + 50;
      const sy = startY + Math.floor(i / 4) * 75 + 80;
      item.draw(ctx, sx, sy, 0.5, 0);
      item.draw(ctx, sx + 12, sy, 0.5, 0);
    });
  }
}

function updateDraggedItemPosition() {
  if (!state.draggedItem) return;

  const targetX = state.mousePos.x - state.dragOffset.x;
  const targetY = state.mousePos.y - state.dragOffset.y;

  // Linear interpolation (0.18 = delay/drag feeling)
  const easing = 0.18;
  state.draggedItem.x += (targetX - state.draggedItem.x) * easing;
  state.draggedItem.y += (targetY - state.draggedItem.y) * easing;
}

export function draw() {
  ctx.clearRect(0, 0, state.width, state.height);

  updateDraggedItemPosition();

  drawBagGraphic(BAG.x, BAG.y, BAG.w, BAG.h);
  drawBasket();
  drawGroundItems();
  drawParticles();
  drawFlyingItems();
  drawPairCounter();
  drawScreenTitle();
  drawBagOverlay();
  drawPairsOverlay();

  requestAnimationFrame(draw);
}
