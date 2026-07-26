// Canvas handle and all mutable game state, shared across modules.
// Kept behind a single `state` object (rather than individually
// exported `let` bindings) so other modules can reassign fields like
// `state.items` and still have every importer see the new value.

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export const state = {
  width: 0,
  height: 0,

  itemType: 'sock', // the pairable item type for the current screen
  items: [],
  bagItems: [],
  matchedPairs: [],
  particles: [],
  flyingItems: [],

  pairedCount: 0,
  currentScreen: 1,

  draggedItem: null,
  dragOffset: { x: 0, y: 0 },
  mousePos: { x: 0, y: 0 },

  showingBagOverlay: false,
  showingPairsOverlay: false,
};

export function resize() {
  state.width = canvas.width = window.innerWidth;
  state.height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Area definitions. Positions are recalculated to fit the viewport
// each time initGame() runs (see screens.js).
export const BAG = { x: 40, y: state.height - 150, w: 100, h: 110 };
export const PAIR_BOX = { x: state.width - 170, y: 20, w: 150, h: 55 };
export const BASKET = { x: state.width - 140, y: state.height - 130, w: 110, h: 90 };
