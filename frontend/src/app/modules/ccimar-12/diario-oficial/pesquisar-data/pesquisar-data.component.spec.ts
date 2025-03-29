import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarDataComponent } from './pesquisar-data.component';

describe('PesquisarDataComponent', () => {
  let component: PesquisarDataComponent;
  let fixture: ComponentFixture<PesquisarDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesquisarDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
