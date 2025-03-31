import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestesMatrizPlanejamentoComponent } from './testes-matriz-planejamento.component';

describe('TestesMatrizPlanejamentoComponent', () => {
  let component: TestesMatrizPlanejamentoComponent;
  let fixture: ComponentFixture<TestesMatrizPlanejamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestesMatrizPlanejamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestesMatrizPlanejamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
