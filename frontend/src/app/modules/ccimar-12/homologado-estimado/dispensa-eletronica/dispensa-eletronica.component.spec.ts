import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PNCPModelComponent } from './dispensa-eletronica.component';

describe('PNCPModelComponent', () => {
  let component: PNCPModelComponent;
  let fixture: ComponentFixture<PNCPModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PNCPModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PNCPModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
