import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiscoIdentificadoComponent } from './risco-identificado.component';

describe('RiscoIdentificadoComponent', () => {
  let component: RiscoIdentificadoComponent;
  let fixture: ComponentFixture<RiscoIdentificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiscoIdentificadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiscoIdentificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
