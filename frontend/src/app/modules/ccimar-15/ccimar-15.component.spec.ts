import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar15Component } from './ccimar-15.component';

describe('Ccimar15Component', () => {
  let component: Ccimar15Component;
  let fixture: ComponentFixture<Ccimar15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar15Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
