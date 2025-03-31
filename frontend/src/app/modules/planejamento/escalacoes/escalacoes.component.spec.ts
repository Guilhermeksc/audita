import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalacoesComponent } from './escalacoes.component';

describe('EscalacoesComponent', () => {
  let component: EscalacoesComponent;
  let fixture: ComponentFixture<EscalacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscalacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
