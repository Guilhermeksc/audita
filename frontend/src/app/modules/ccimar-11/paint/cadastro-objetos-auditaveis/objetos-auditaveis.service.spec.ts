import { TestBed } from '@angular/core/testing';

import { ObjetosAuditaveisService } from './objetos-auditaveis.service';

describe('ObjetosAuditaveisService', () => {
  let service: ObjetosAuditaveisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetosAuditaveisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
