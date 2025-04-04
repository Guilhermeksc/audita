import { TestBed } from '@angular/core/testing';

import { RiscosService } from './riscos.service';

describe('RiscosService', () => {
  let service: RiscosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiscosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
