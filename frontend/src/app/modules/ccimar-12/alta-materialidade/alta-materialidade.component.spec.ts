import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaMaterialidadeComponent } from './alta-materialidade.component';

describe('AltaMaterialidadeComponent', () => {
  let component: AltaMaterialidadeComponent;
  let fixture: ComponentFixture<AltaMaterialidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaMaterialidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaMaterialidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
