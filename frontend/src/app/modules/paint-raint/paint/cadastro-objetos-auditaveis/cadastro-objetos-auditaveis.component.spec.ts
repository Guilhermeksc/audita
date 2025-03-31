import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroObjetosAuditaveisComponent } from './cadastro-objetos-auditaveis.component';

describe('CadastroObjetosAuditaveisComponent', () => {
  let component: CadastroObjetosAuditaveisComponent;
  let fixture: ComponentFixture<CadastroObjetosAuditaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroObjetosAuditaveisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroObjetosAuditaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
