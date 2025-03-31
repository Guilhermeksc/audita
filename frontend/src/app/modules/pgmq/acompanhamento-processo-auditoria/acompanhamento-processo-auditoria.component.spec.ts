import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoProcessoAuditoriaComponent } from './acompanhamento-processo-auditoria.component';

describe('AcompanhamentoProcessoAuditoriaComponent', () => {
  let component: AcompanhamentoProcessoAuditoriaComponent;
  let fixture: ComponentFixture<AcompanhamentoProcessoAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcompanhamentoProcessoAuditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcompanhamentoProcessoAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
