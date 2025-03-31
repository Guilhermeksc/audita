import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintRaintComponent } from './paint-raint.component';

describe('Ccimar11Component', () => {
  let component: PaintRaintComponent;
  let fixture: ComponentFixture<PaintRaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintRaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintRaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
