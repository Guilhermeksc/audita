import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaintComponent } from './raint.component';

describe('RaintComponent', () => {
  let component: RaintComponent;
  let fixture: ComponentFixture<RaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
