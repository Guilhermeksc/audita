import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheDispensaEletronicaComponent } from './detalhe-dispensa-eletronica.component';

describe('DetalheDispensaEletronicaComponent', () => {
  let component: DetalheDispensaEletronicaComponent;
  let fixture: ComponentFixture<DetalheDispensaEletronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheDispensaEletronicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheDispensaEletronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
