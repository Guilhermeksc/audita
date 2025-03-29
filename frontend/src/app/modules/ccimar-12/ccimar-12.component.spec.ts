import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar12Component } from './ccimar-12.component';

describe('Ccimar12Component', () => {
  let component: Ccimar12Component;
  let fixture: ComponentFixture<Ccimar12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar12Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
