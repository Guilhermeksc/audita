import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar13Component } from './ccimar-13.component';

describe('Ccimar13Component', () => {
  let component: Ccimar13Component;
  let fixture: ComponentFixture<Ccimar13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar13Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
