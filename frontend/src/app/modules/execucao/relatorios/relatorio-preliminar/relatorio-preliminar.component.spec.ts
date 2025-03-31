import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioPreliminarComponent } from './relatorio-preliminar.component';

describe('RelatorioPreliminarComponent', () => {
  let component: RelatorioPreliminarComponent;
  let fixture: ComponentFixture<RelatorioPreliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioPreliminarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioPreliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
