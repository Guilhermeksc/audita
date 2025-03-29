import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoesOrcamentariasComponent } from './acoes-orcamentarias.component';

describe('AcoesOrcamentariasComponent', () => {
  let component: AcoesOrcamentariasComponent;
  let fixture: ComponentFixture<AcoesOrcamentariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcoesOrcamentariasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcoesOrcamentariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
