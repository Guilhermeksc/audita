import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgmqComponent } from './pgmq.component';

describe('PgmqComponent', () => {
  let component: PgmqComponent;
  let fixture: ComponentFixture<PgmqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgmqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgmqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
