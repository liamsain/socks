import { PAIR_BOX } from './state.js';

// Plays the short flight of two matched items (socks, shoes, ...) from
// their meeting point into the pair counter box.
export class FlyingItemAnimation {
  constructor(item1, item2) {
    this.item1 = item1;
    this.item2 = item2;
    this.startX1 = item1.x; this.startY1 = item1.y;
    this.startX2 = item2.x; this.startY2 = item2.y;
    this.targetX = PAIR_BOX.x + 30;
    this.targetY = PAIR_BOX.y + 25;
    this.progress = 0;
  }

  update() {
    this.progress += 0.04;
    return this.progress >= 1;
  }

  draw(context) {
    const p = Math.min(1, this.progress);
    const easeP = p * p * (3 - 2 * p);

    const curX1 = this.startX1 + (this.targetX - this.startX1) * easeP;
    const curY1 = this.startY1 + (this.targetY - this.startY1) * easeP;
    const curX2 = this.startX2 + (this.targetX - this.startX2) * easeP;
    const curY2 = this.startY2 + (this.targetY - this.startX2) * easeP;

    const scale = (1 - easeP * 0.6) * 0.5;

    this.item1.draw(context, curX1, curY1, scale, 0);
    this.item2.draw(context, curX2 + 10, curY2, scale, 0);
  }
}
