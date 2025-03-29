import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioOficialComponent } from './diario-oficial.component';

describe('DiarioOficialComponent', () => {
  let component: DiarioOficialComponent;
  let fixture: ComponentFixture<DiarioOficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiarioOficialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarioOficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
