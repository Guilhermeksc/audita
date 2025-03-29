import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ccimar16Component } from './ccimar-16.component';

describe('Ccimar16Component', () => {
  let component: Ccimar16Component;
  let fixture: ComponentFixture<Ccimar16Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ccimar16Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ccimar16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
