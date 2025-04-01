import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhePNCPModelComponent } from './detalhe-dispensa-eletronica.component';

describe('DetalhePNCPModelComponent', () => {
  let component: DetalhePNCPModelComponent;
  let fixture: ComponentFixture<DetalhePNCPModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhePNCPModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhePNCPModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
