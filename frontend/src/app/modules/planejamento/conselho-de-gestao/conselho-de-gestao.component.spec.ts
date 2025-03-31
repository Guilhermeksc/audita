import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConselhoDeGestaoComponent } from './conselho-de-gestao.component';

describe('ConselhoDeGestaoComponent', () => {
  let component: ConselhoDeGestaoComponent;
  let fixture: ComponentFixture<ConselhoDeGestaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConselhoDeGestaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConselhoDeGestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
