import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologadoEstimadoComponent } from './homologado-estimado.component';

describe('HomologadoEstimadoComponent', () => {
  let component: HomologadoEstimadoComponent;
  let fixture: ComponentFixture<HomologadoEstimadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomologadoEstimadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomologadoEstimadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
