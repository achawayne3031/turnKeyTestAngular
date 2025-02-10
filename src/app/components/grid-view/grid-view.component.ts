import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from 'src/app/interface/contact';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
})
export class GridViewComponent {
  @Input() contactData: Contact[] | any;
  @Output() OnSelectedContactItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnTickedContactItem: EventEmitter<any> = new EventEmitter<any>();

  selectedContactItem(contact: any, type: string) {
    contact.type = type;
    this.OnSelectedContactItem.emit(contact);
  }

  tickContact(contact: any, $event: any) {
    contact.checked = !contact.checked;
    this.OnTickedContactItem.emit(contact);
  }

  constructor(public utilService: UtilServiceService) {}
}
