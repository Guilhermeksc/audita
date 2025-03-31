import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoPeriodicaComponent } from './avaliacao-periodica.component';

describe('AvaliacaoPeriodicaComponent', () => {
  let component: AvaliacaoPeriodicaComponent;
  let fixture: ComponentFixture<AvaliacaoPeriodicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoPeriodicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoPeriodicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
