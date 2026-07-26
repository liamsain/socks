import { Item } from './item.js';

export class Sock extends Item {
  constructor(id, color, pattern, targetX, targetY, delayFrames = 0) {
    super('sock', id, color, pattern, targetX, targetY, delayFrames);
  }

  drawShape(context) {
    // Main body
    context.beginPath();
    context.moveTo(-15, -35);
    context.lineTo(15, -35);
    context.lineTo(15, 10);
    context.arcTo(15, 30, 35, 30, 15);
    context.lineTo(35, 30);
    context.arcTo(45, 30, 45, 45, 15);
    context.arcTo(45, 50, 30, 50, 15);
    context.lineTo(-5, 50);
    context.arcTo(-15, 50, -15, 35, 15);
    context.closePath();

    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = '#2c3e50';
    context.stroke();

    // Heel and toe accents
    context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context.beginPath(); context.arc(-5, 35, 10, 0, Math.PI * 2); context.fill();
    context.beginPath(); context.arc(35, 40, 8, 0, Math.PI * 2); context.fill();

    // Cuff / top
    context.fillStyle = '#ffffff';
    context.fillRect(-17, -40, 34, 8);
    context.strokeRect(-17, -40, 34, 8);

    // Patterns
    if (this.pattern === 'striped') {
      context.fillStyle = '#ffffff';
      context.fillRect(-13, -20, 26, 4);
      context.fillRect(-13, -10, 26, 4);
      context.fillRect(-13, 0, 26, 4);
    } else if (this.pattern === 'polka') {
      context.fillStyle = '#ffffff';
      [-5, 5].forEach(px => {
        [-20, -5, 10].forEach(py => {
          context.beginPath();
          context.arc(px, py, 2.5, 0, Math.PI * 2);
          context.fill();
        });
      });
    }
  }
}
