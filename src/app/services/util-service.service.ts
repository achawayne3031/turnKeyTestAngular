import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilServiceService {
  isDarkModeSub = new Subject();

  constructor() {}

  isValidImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };
    });
  }

  setViewSettings(settings: string): void {
    window.localStorage.setItem('turnKeyViewSettings', settings);
  }

  getViewSettings() {
    let uniqueId = null;
    const viewSettings = window.localStorage.getItem('turnKeyViewSettings');
    if (viewSettings != null && viewSettings !== undefined) {
      return viewSettings;
    } else {
      return false;
    }
  }

  getUserFirstLetter(name: string): any {
    if (name != undefined && name != '') {
      let firstLetter = name.charAt(0);
      return firstLetter.toUpperCase();
    }
  }
}
