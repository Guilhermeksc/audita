import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaConclusaoComponent } from './alerta-conclusao.component';

describe('AlertaConclusaoComponent', () => {
  let component: AlertaConclusaoComponent;
  let fixture: ComponentFixture<AlertaConclusaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaConclusaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaConclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
