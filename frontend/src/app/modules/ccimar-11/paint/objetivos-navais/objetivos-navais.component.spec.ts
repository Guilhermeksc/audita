import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosNavaisComponent } from './objetivos-navais.component';

describe('ObjetivosNavaisComponent', () => {
  let component: ObjetivosNavaisComponent;
  let fixture: ComponentFixture<ObjetivosNavaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetivosNavaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivosNavaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
