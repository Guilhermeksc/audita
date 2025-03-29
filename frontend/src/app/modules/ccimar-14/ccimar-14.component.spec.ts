import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar14Component } from './ccimar-14.component';

describe('Ccimar14Component', () => {
  let component: Ccimar14Component;
  let fixture: ComponentFixture<Ccimar14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar14Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
