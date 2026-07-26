import { BASKET, ITEM_SCALE } from './state.js';

// Shared behavior for anything the player can throw, drag, and pair up
// (socks, shoes, ...). Subclasses implement drawShape() for their own
// silhouette; spawn-throw animation, matching, and hit testing live here
// so every item type gets them for free.
export class Item {
  constructor(type, id, color, pattern, targetX, targetY, delayFrames = 0) {
    this.type = type;
    this.id = id;
    this.color = color;
    this.pattern = pattern;

    // Final rested coordinates
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetRotation = (Math.random() - 0.5) * 1.5;

    // Throw animation state, starting at the laundry basket
    this.delayFrames = delayFrames;
    this.isSpawining = true;
    this.spawnProgress = 0;
    this.startX = BASKET.x + BASKET.w / 2;
    this.startY = BASKET.y + 20;
    this.arcHeight = 150 + Math.random() * 150; // Dynamic parabola height

    this.x = this.startX;
    this.y = this.startY;
    this.rotation = Math.random() * Math.PI * 4;

    this.hitRadius = 35 * ITEM_SCALE;
  }

  matches(other) {
    return this.type === other.type && this.color === other.color && this.pattern === other.pattern;
  }

  updateSpawn() {
    if (this.delayFrames > 0) {
      this.delayFrames--;
      return;
    }

    if (!this.isSpawining) return;

    this.spawnProgress += 0.025; // Speed of throw
    if (this.spawnProgress >= 1) {
      this.spawnProgress = 1;
      this.isSpawining = false;
      this.x = this.targetX;
      this.y = this.targetY;
      this.rotation = this.targetRotation;
      return;
    }

    const t = this.spawnProgress;
    // Linear horizontal move
    this.x = this.startX + (this.targetX - this.startX) * t;

    // Parabolic vertical arc (up and drop down)
    const directY = this.startY + (this.targetY - this.startY) * t;
    const arc = Math.sin(t * Math.PI) * this.arcHeight;
    this.y = directY - arc;

    // Tumble rotation mid-air
    this.rotation = t * Math.PI * 4 + this.targetRotation;
  }

  draw(context, customX = this.x, customY = this.y, scale = ITEM_SCALE, rotation = this.rotation) {
    context.save();
    context.translate(customX, customY);
    context.rotate(rotation);
    context.scale(scale, scale);

    this.drawShape(context);

    context.restore();
  }

  // Subclasses draw their own silhouette + pattern here, in the same
  // local coordinate space set up by draw() above.
  drawShape(_context) {
    throw new Error(`${this.constructor.name} must implement drawShape()`);
  }

  isPointInside(px, py) {
    if (this.isSpawining || this.delayFrames > 0) return false;
    const dx = px - this.x;
    const dy = py - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.hitRadius;
  }
}
