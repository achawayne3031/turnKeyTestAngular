import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from 'src/app/interface/contact';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent {
  @Input() contactData: Contact[] | undefined;
  @Output() OnSelectedContactItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnTickedContactItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnMarkAsFavoriteContactItem: EventEmitter<any> =
    new EventEmitter<any>();

  selectedContactItem(contact: any, type: string) {
    contact.type = type;
    this.OnSelectedContactItem.emit(contact);
  }

  tickContact(contact: any, $event: any) {
    contact.checked = !contact.checked;
    this.OnTickedContactItem.emit(contact);
  }

  markAsFavorite(contact: any, state: boolean) {
    contact.favorite = state;
    this.OnMarkAsFavoriteContactItem.emit(contact);
  }

  constructor(public utilService: UtilServiceService) {}
}
