import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimativaDemandaComponent } from './estimativa-demanda.component';

describe('EstimativaDemandaComponent', () => {
  let component: EstimativaDemandaComponent;
  let fixture: ComponentFixture<EstimativaDemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimativaDemandaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimativaDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
