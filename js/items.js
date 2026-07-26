import { Sock } from './sock.js';
import { Shoe } from './shoe.js';

// Single source of truth for which item classes the game can spawn.
// Add a new pairable item type by adding an entry here.
export const ITEM_CLASSES = { sock: Sock, shoe: Shoe };
