import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredenciamentoComponent } from './credenciamento.component';

describe('CredenciamentoComponent', () => {
  let component: CredenciamentoComponent;
  let fixture: ComponentFixture<CredenciamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredenciamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredenciamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
