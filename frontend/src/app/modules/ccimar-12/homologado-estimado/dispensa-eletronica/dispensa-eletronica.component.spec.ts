import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensaEletronicaComponent } from './dispensa-eletronica.component';

describe('DispensaEletronicaComponent', () => {
  let component: DispensaEletronicaComponent;
  let fixture: ComponentFixture<DispensaEletronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispensaEletronicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispensaEletronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
