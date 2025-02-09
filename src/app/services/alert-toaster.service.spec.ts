import { TestBed } from '@angular/core/testing';

import { AlertToasterService } from './alert-toaster.service';

describe('AlertToasterService', () => {
  let service: AlertToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
