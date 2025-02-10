import { Component } from '@angular/core';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  isDarkMode: boolean = false;

  constructor(private utilService: UtilServiceService) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('bg-dark', 'text-white');
      document.body.classList.remove('bg-light', 'text-dark');
      this.utilService.isDarkModeSub.next(true);
    } else {
      document.body.classList.add('bg-light', 'text-dark');
      document.body.classList.remove('bg-dark', 'text-white');
      this.utilService.isDarkModeSub.next(false);
    }
  }
}
