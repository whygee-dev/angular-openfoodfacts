import { Injectable } from '@angular/core';
import { HistoryItem } from './types';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : null;
  }

  set(key: string, value: unknown) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    return localStorage.removeItem(key);
  }

  addToHistory(id: string) {
    const history = this.getHistory();

    if (history) {
      history.push({ id, timestamp: Date.now() });

      this.set('history', history);
    } else {
      this.set('history', [{ id, timestamp: Date.now() }]);
    }
  }

  getHistory() {
    return this.get<HistoryItem[]>('history');
  }
}
