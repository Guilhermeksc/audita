import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiscosComponent } from './riscos.component';

describe('RiscosComponent', () => {
  let component: RiscosComponent;
  let fixture: ComponentFixture<RiscosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiscosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiscosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
