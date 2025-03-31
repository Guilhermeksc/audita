import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioFinalComponent } from './relatorio-final.component';

describe('RelatorioFinalComponent', () => {
  let component: RelatorioFinalComponent;
  let fixture: ComponentFixture<RelatorioFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
