import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertToasterService {
  displayPos = '';

  constructor(private toasterService: ToastrService) {}

  renderErrorMsgArray(msg: any) {
    if (Array.isArray(msg)) {
      msg.map((value: string) => {
        this.errorMsg(value);
      });
    } else {
      this.errorMsg(msg);
    }
  }

  errorMsg(msg: string) {
    this.toasterService.error(`${msg}`, 'Error');
  }

  successMsg(msg: string) {
    this.toasterService.success(`${msg}`, 'Success');
  }

  infoMsg(msg: string) {
    this.toasterService.info(`${msg}`, 'Info');
  }

  warnMsg(msg: string) {
    this.toasterService.warning(`${msg}`, 'Warning');
  }
}
