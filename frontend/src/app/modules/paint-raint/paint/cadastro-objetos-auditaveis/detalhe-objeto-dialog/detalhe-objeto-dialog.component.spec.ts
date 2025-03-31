import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheObjetoDialogComponent } from './detalhe-objeto-dialog.component';

describe('DetalheObjetoDialogComponent', () => {
  let component: DetalheObjetoDialogComponent;
  let fixture: ComponentFixture<DetalheObjetoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheObjetoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheObjetoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
