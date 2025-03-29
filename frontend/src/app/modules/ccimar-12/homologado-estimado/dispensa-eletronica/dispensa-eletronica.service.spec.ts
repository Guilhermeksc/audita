import { TestBed } from '@angular/core/testing';

import { DispensaEletronicaService } from './dispensa-eletronica.service';

describe('DispensaEletronicaService', () => {
  let service: DispensaEletronicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispensaEletronicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
