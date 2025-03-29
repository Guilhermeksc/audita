import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsistenciaComponent } from './subsistencia.component';

describe('SubsistenciaComponent', () => {
  let component: SubsistenciaComponent;
  let fixture: ComponentFixture<SubsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
