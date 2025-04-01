import { TestBed } from '@angular/core/testing';

import { PNCPModelService } from './dispensa-eletronica.service';

describe('PNCPModelService', () => {
  let service: PNCPModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PNCPModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
