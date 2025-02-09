import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilServiceService {
  constructor() {}

  getUserFirstLetter(name: string): any {
    if (name != undefined && name != '') {
      let firstLetter = name.charAt(0);
      return firstLetter.toUpperCase();
    }
  }
}
