import { state, BAG, PAIR_BOX, BASKET } from './state.js';
import { COLORS, PATTERNS } from './constants.js';
import { ITEM_CLASSES } from './items.js';
import { Particle } from './particle.js';
import { FlyingItemAnimation } from './flying-item-animation.js';

const SHOE_CHANCE = 1; // sock pairing disabled for now; every screen is shoes

function getRandomX() { return 100 + Math.random() * (state.width - 280); }
function getRandomY() { return 120 + Math.random() * (state.height - 280); }

// Sock pairing is temporarily disabled: every screen pairs shoes.
function pickItemType(_screenNumber) {
  return Math.random() < SHOE_CHANCE ? 'shoe' : 'sock';
}

export function generateNextScreen() {
  state.itemType = pickItemType(state.currentScreen);
  const ItemClass = ITEM_CLASSES[state.itemType];

  state.items = [];
  const numPairs = 4 + Math.floor(Math.random() * 3);
  let globalId = Date.now();
  let throwDelay = 0;

  // Pairs
  for (let i = 0; i < numPairs; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

    state.items.push(new ItemClass(globalId++, color, pattern, getRandomX(), getRandomY(), throwDelay));
    throwDelay += 3;
    state.items.push(new ItemClass(globalId++, color, pattern, getRandomX(), getRandomY(), throwDelay));
    throwDelay += 3;
  }

  // Odds
  const numOdd = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numOdd; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    state.items.push(new ItemClass(globalId++, color, pattern, getRandomX(), getRandomY(), throwDelay));
    throwDelay += 3;
  }

  // Bag counterparts: only ones matching this screen's item type, so a
  // spare shoe doesn't get a sock counterpart spawned (and vice versa).
  const matchingBagItems = state.bagItems.filter(item => item.type === state.itemType);
  if (matchingBagItems.length > 0) {
    const matchCandidates = [...matchingBagItems].sort(() => 0.5 - Math.random()).slice(0, 2);
    matchCandidates.forEach(bagItem => {
      state.items.push(new ItemClass(globalId++, bagItem.color, bagItem.pattern, getRandomX(), getRandomY(), throwDelay));
      throwDelay += 3;
    });
  }
}

export function initGame() {
  BAG.y = state.height - 150;
  PAIR_BOX.x = state.width - 170;
  BASKET.x = state.width - 140;
  BASKET.y = state.height - 130;

  state.items = [];
  state.bagItems = [];
  state.matchedPairs = [];
  state.particles = [];
  state.flyingItems = [];
  state.pairedCount = 0;
  state.currentScreen = 1;

  generateNextScreen();
}

export function triggerMatchEffect(item1, item2) {
  const midX = (item1.x + item2.x) / 2;
  const midY = (item1.y + item2.y) / 2;

  for (let i = 0; i < 35; i++) {
    state.particles.push(new Particle(midX, midY, item1.color));
    state.particles.push(new Particle(midX, midY, '#f1c40f'));
  }

  state.flyingItems.push(new FlyingItemAnimation(item1, item2));
}

export function checkScreenCompletion() {
  if (state.items.length === 0) {
    state.currentScreen++;
    generateNextScreen();
  }
}
