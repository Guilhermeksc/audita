import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexoAObjetosAuditaveisComponent } from './anexo-a-objetos-auditaveis.component';

describe('AnexoAObjetosAuditaveisComponent', () => {
  let component: AnexoAObjetosAuditaveisComponent;
  let fixture: ComponentFixture<AnexoAObjetosAuditaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexoAObjetosAuditaveisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnexoAObjetosAuditaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
