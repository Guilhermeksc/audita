import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar10Component } from './ccimar-10.component';

describe('Ccimar10Component', () => {
  let component: Ccimar10Component;
  let fixture: ComponentFixture<Ccimar10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar10Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
