import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarHistoricoComponent } from './pesquisar-historico.component';

describe('PesquisarHistoricoComponent', () => {
  let component: PesquisarHistoricoComponent;
  let fixture: ComponentFixture<PesquisarHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesquisarHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
