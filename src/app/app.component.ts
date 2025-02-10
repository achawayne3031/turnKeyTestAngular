import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpRequestService } from './services/http-request.service';
import { Contact } from './interface/contact';
import { AlertToasterService } from './services/alert-toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilServiceService } from './services/util-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'turnKeyTestAngular';
  contactData: Contact[] | undefined;
  initalContactData: Contact[] | undefined;

  selectedContact: Contact | undefined;

  @ViewChild('viewContactModalBtn') viewContactModalBtn!: ElementRef;
  @ViewChild('closeAddContactBtn') closeAddContactBtn!: ElementRef;
  @ViewChild('addContactBtn') addContactBtn!: ElementRef;
  @ViewChild('addContactBtnTarget') addContactBtnTarget!: ElementRef;
  @ViewChild('showViewSettingConfig') showViewSettingConfig!: ElementRef;

  contactForm!: FormGroup;
  manualChecker = false;
  isLoading = false;
  searchText = '';
  isEdit = false;
  tickedContactData: any[] = [];
  isDarkMode = false;
  isListView = this.utilService.getViewSettings() == 'list' ? true : false;
  favoriteContactItems: any[] = [];
  showFavorite = false;

  constructor(
    private httpService: HttpRequestService,
    private alertService: AlertToasterService,
    private fb: FormBuilder,
    private utilService: UtilServiceService
  ) {}

  ngOnInit(): void {
    this.getAllContacts();
    this.buildContactForm();

    this.utilService.isDarkModeSub.subscribe((data: any) => {
      this.isDarkMode = data;
    });
  }

  ngAfterViewInit() {
    let viewSettings = this.utilService.getViewSettings();
    if (viewSettings === false) {
      this.showViewSettingConfig.nativeElement.click();
    } else {
      if (viewSettings == 'list') {
        this.isListView = true;
      } else {
        this.isListView = false;
      }
    }
  }

  showFavoriteContact() {
    this.showFavorite = !this.showFavorite;

    if (this.showFavorite) {
      this.contactData = this.favoriteContactItems;
    } else {
      this.contactData = this.initalContactData;
    }
  }

  onMarkAsFavoriteContact(contact: any) {
    if (contact.favorite) {
      this.favoriteContactItems.push(contact);
    } else {
      this.favoriteContactItems = this.favoriteContactItems.filter(
        (item) => item.id !== contact.id
      );
    }
  }

  onFilterByGroup(group: any) {
    this.httpService
      .getRequest(`/contact/filter-group?contactGroup=${group.target.value}`)
      .subscribe(
        (data: any) => {
          let contactData = data.data;
          this.contactData = contactData.map((item: any) => {
            item.checked = false;
            item.favorite = false;
            return item;
          });
          this.initalContactData = this.contactData;
        },
        (error) => {
          this.alertService.errorMsg(error.message);
        }
      );
  }

  exportInCsvFile() {
    this.httpService.getRequest('/contact/export').subscribe(
      (data: any) => {
        let csvContent = atob(data.data);
        var blob = new Blob([csvContent], {
          type: 'data:application/octet-stream;base64',
        });
        var url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contacts.csv`;
        link.click();
      },
      (error) => {
        this.alertService.errorMsg(error.message);
      }
    );
  }

  activateViewSettings(type: string) {
    if (type == 'list') {
      this.isListView = true;
    } else {
      this.isListView = false;
    }
    this.utilService.setViewSettings(type);
  }

  bulkDeleteContact() {
    if (this.tickedContactData.length == 0) {
      this.alertService.errorMsg('no contact item selected...');
      return;
    }

    if (confirm('You are about to bulk delete all this contacts !!!')) {
      this.httpService
        .deleteRequest('/contact/bulk-delete', { body: this.tickedContactData })
        .subscribe(
          (data) => {
            if (data.status) {
              this.tickedContactData = [];
              this.alertService.successMsg(data.message);
              this.getAllContacts();
            } else {
              this.alertService.errorMsg(data.message);
            }
          },
          (error) => {}
        );
    }
  }

  onTickedContactData(data: any) {
    if (data != null && data != undefined) {
      if (data.checked) {
        this.tickedContactData.push(data.id);
      } else {
        this.tickedContactData = this.tickedContactData.filter(
          (item) => item !== data.id
        );
      }
    }
  }

  deleteContact(data: any) {
    if (confirm('You are about to delete this contact !!!')) {
      this.httpService
        .getRequest(`/contact/delete?contactId=${data.id}`)
        .subscribe(
          (data: any) => {
            if (data.status) {
              this.alertService.successMsg(data.message);
              this.getAllContacts();
            } else {
              this.alertService.errorMsg(data.message);
            }
          },
          (error) => {
            this.alertService.errorMsg(error.message);
          }
        );
    }
  }

  searchData() {
    if (this.searchText != '') {
      this.httpService
        .getRequest(`/contact/search?search=${this.searchText}`)
        .subscribe(
          (data: any) => {
            let contactData = data.data;
            this.contactData = contactData.map((item: any) => {
              item.checked = false;
              item.favorite = false;
              return item;
            });
            this.initalContactData = this.contactData;
          },
          (error) => {
            this.alertService.errorMsg(error.message);
          }
        );
    }
  }

  submitContact() {
    if (this.contactForm.status == 'VALID') {
      this.isLoading = true;

      let url = '';
      if (this.isEdit) {
        url = '/contact/update';
      } else {
        url = '/contact/add';
      }

      this.httpService.postRequest(url, this.contactForm.value).subscribe(
        (data) => {
          this.isLoading = false;
          this.isEdit = false;

          if (data.status) {
            this.manualChecker = false;

            this.closeAddContactBtn.nativeElement.click();

            this.alertService.successMsg(data.message);
            this.contactForm.reset();
            this.getAllContacts();
          } else {
            this.alertService.errorMsg(data.message);
          }
        },
        (error) => {
          this.isLoading = false;
          setTimeout(() => {
            if (error.response !== null) {
              this.alertService.renderErrorMsgArray(error.response);
            }
          }, 500);
        }
      );
    } else {
      this.manualChecker = true;
    }
  }

  get contactFormControls() {
    return this.contactForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.contactFormControls.firstName.hasError('required')
    ) {
      return 'first name is required';
    } else if (
      instance === 'lastName' &&
      this.contactFormControls.lastName.hasError('required')
    ) {
      return 'last name is required';
    } else if (
      instance === 'email' &&
      this.contactFormControls.email.hasError('required')
    ) {
      return 'email is required';
    } else if (
      instance === 'email' &&
      this.contactFormControls.email.hasError('email')
    ) {
      return 'valid email address only';
    } else if (
      instance === 'phoneNumber' &&
      this.contactFormControls.phoneNumber.hasError('required')
    ) {
      return 'phone number is required';
    } else if (
      instance === 'physicalAddress' &&
      this.contactFormControls.physicalAddress.hasError('required')
    ) {
      return 'address is required';
    } else {
      return '';
    }
  }

  buildContactForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      physicalAddress: ['', [Validators.required]],
      contactGroup: [''],
      contactImage: [''],
      id: [''],
    });
  }

  onSelectedContactGroup(event: any) {}

  showAddModal() {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      physicalAddress: ['', [Validators.required]],
      contactGroup: [''],
      contactImage: [''],
      id: [''],
    });
    this.isEdit = false;
    /// this.addContactBtn.nativeElement.click();
  }

  onSelectedContactData(data: any) {
    this.selectedContact = data;

    switch (data.type) {
      case 'view':
        this.viewContactModalBtn.nativeElement.click();

        break;

      case 'delete':
        this.deleteContact(data);
        break;

      case 'edit':
        this.contactForm = this.fb.group({
          firstName: [data.firstName, [Validators.required]],
          lastName: [data.lastName, [Validators.required]],
          email: [data.email, [Validators.required, Validators.email]],
          phoneNumber: [data.phoneNumber, [Validators.required]],
          physicalAddress: [data.physicalAddress, [Validators.required]],
          contactGroup: [data.contactGroup],
          contactImage: [data.contactImage],
          id: [data.id],
        });
        this.isEdit = true;
        this.addContactBtnTarget.nativeElement.click();

        break;

      default:
        break;
    }
  }

  getAllContacts() {
    this.httpService.getRequest('/contact/').subscribe(
      (data: any) => {
        let contactData = data.data;
        this.contactData = contactData.map((item: any) => {
          item.checked = false;
          item.favorite = false;
          return item;
        });
        this.initalContactData = this.contactData;
      },
      (error) => {
        this.alertService.errorMsg(error.message);
      }
    );
  }
}
