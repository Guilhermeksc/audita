import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiosComponent } from './subsidios.component';

describe('SubsidiosComponent', () => {
  let component: SubsidiosComponent;
  let fixture: ComponentFixture<SubsidiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsidiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsidiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
