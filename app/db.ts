// db.ts
import Dexie, { Table } from 'dexie';
import { SwipeType } from './types';

export interface Swipe {
  id?: number;
  type: SwipeType;
  target: string;
  category: string;
  timestamp: Date;
}

export class BaljanBadooDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  swipes!: Table<Swipe>; 

  constructor() {
    super('baljanBadooDatabase');
    this.version(1).stores({
      swipes: '++id, type, target, category, timestamp' // Primary key and indexed props
    });
  }
}

export const db = new BaljanBadooDB();