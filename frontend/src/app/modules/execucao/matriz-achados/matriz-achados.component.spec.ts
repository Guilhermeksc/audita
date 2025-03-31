import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizAchadosComponent } from './matriz-achados.component';

describe('MatrizAchadosComponent', () => {
  let component: MatrizAchadosComponent;
  let fixture: ComponentFixture<MatrizAchadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizAchadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizAchadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
