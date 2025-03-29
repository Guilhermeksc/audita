import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar11Component } from './ccimar-11.component';

describe('Ccimar11Component', () => {
  let component: Ccimar11Component;
  let fixture: ComponentFixture<Ccimar11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar11Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
