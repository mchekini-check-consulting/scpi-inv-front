import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiCardComponent } from './scpi-card.component';

describe('ScpiCardComponent', () => {
  let component: ScpiCardComponent;
  let fixture: ComponentFixture<ScpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
