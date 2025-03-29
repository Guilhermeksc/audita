import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregaoEletronicoComponent } from './pregao-eletronico.component';

describe('PregaoEletronicoComponent', () => {
  let component: PregaoEletronicoComponent;
  let fixture: ComponentFixture<PregaoEletronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregaoEletronicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregaoEletronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
