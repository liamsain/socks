import { Item } from './item.js';

function darken(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export class Shoe extends Item {
  constructor(id, color, pattern, targetX, targetY, delayFrames = 0) {
    super('shoe', id, color, pattern, targetX, targetY, delayFrames);
    this.hitRadius = 44;
    this.isRightFoot = Math.random() < 0.5;
    // Derived from color (not randomized) so a matched pair renders identically.
    this.accentColor = darken(color, 40);
  }

  drawShape(context) {
    context.save();
    if (!this.isRightFoot) {
      context.scale(-1, 1);
    }

    // Shadow
    context.fillStyle = 'rgba(0, 0, 0, 0.15)';
    context.beginPath();
    context.ellipse(0, 22, 38, 10, 0, 0, Math.PI * 2);
    context.fill();

    // Main upper (canvas body)
    context.fillStyle = this.color;
    context.strokeStyle = '#2c3e50';
    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(-28, -20);
    context.lineTo(-12, -20);
    context.quadraticCurveTo(-5, -10, 10, -5);
    context.quadraticCurveTo(28, 0, 36, 10);
    context.arcTo(38, 20, 20, 20, 8);
    context.lineTo(-30, 20);
    context.arcTo(-35, 20, -35, -10, 12);
    context.quadraticCurveTo(-35, -15, -28, -20);
    context.closePath();
    context.fill();
    context.stroke();

    // Heel back tab
    context.fillStyle = this.accentColor;
    context.beginPath();
    context.rect(-34, -5, 8, 23);
    context.fill();
    context.stroke();

    // Ankle collar rim (padding)
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.rect(-29, -23, 18, 5);
    context.fill();
    context.stroke();

    // Rubber toe cap
    context.fillStyle = '#f8f9fa';
    context.beginPath();
    context.moveTo(18, -2);
    context.quadraticCurveTo(28, 2, 36, 10);
    context.arcTo(38, 20, 20, 20, 8);
    context.lineTo(18, 20);
    context.quadraticCurveTo(20, 8, 18, -2);
    context.closePath();
    context.fill();
    context.stroke();

    // Rubber sole
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.roundRect(-34, 14, 72, 10, [0, 4, 4, 4]);
    context.fill();
    context.stroke();

    // Sole pinstripe
    context.strokeStyle = '#e74c3c';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-32, 18);
    context.lineTo(36, 18);
    context.stroke();

    context.strokeStyle = '#2c3e50';
    context.lineWidth = 2;

    // Eyelets & laces
    const eyelets = [
      { x: -5, y: -8 },
      { x: 3, y: -4 },
      { x: 11, y: 0 },
      { x: 19, y: 4 },
    ];

    context.strokeStyle = '#ffffff';
    context.lineWidth = 2.5;
    context.beginPath();
    for (let i = 0; i < eyelets.length - 1; i++) {
      context.moveTo(eyelets[i].x, eyelets[i].y);
      context.lineTo(eyelets[i + 1].x + 2, eyelets[i + 1].y - 3);
    }
    context.stroke();

    eyelets.forEach(pt => {
      context.fillStyle = '#bdc3c7';
      context.strokeStyle = '#2c3e50';
      context.lineWidth = 1;
      context.beginPath();
      context.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });

    // Pattern, on the plain canvas panel between the heel tab and laces
    if (this.pattern === 'striped') {
      context.fillStyle = 'rgba(255, 255, 255, 0.85)';
      context.fillRect(-24, -12, 16, 3);
      context.fillRect(-24, -4, 16, 3);
      context.fillRect(-24, 4, 16, 3);
    } else if (this.pattern === 'polka') {
      context.fillStyle = 'rgba(255, 255, 255, 0.85)';
      [-20, -10].forEach(px => {
        [-10, 0, 10].forEach(py => {
          context.beginPath();
          context.arc(px, py, 2, 0, Math.PI * 2);
          context.fill();
        });
      });
    }

    context.restore();
  }
}
