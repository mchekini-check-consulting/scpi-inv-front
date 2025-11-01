import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiInvestComponent } from './scpi-invest.component';

describe('ScpiInvestComponent', () => {
  let component: ScpiInvestComponent;
  let fixture: ComponentFixture<ScpiInvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiInvestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
