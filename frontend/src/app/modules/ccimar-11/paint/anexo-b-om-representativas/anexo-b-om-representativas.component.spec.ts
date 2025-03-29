import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexoBOmRepresentativasComponent } from './anexo-b-om-representativas.component';

describe('AnexoBOmRepresentativasComponent', () => {
  let component: AnexoBOmRepresentativasComponent;
  let fixture: ComponentFixture<AnexoBOmRepresentativasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexoBOmRepresentativasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnexoBOmRepresentativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
