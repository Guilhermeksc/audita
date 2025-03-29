import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestricaoFornecedoresComponent } from './restricao-fornecedores.component';

describe('RestricaoFornecedoresComponent', () => {
  let component: RestricaoFornecedoresComponent;
  let fixture: ComponentFixture<RestricaoFornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestricaoFornecedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestricaoFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
