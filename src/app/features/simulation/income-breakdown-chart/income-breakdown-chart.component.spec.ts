import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeBreakdownChartComponent } from './income-breakdown-chart.component';

describe('IncomeBreakdownChartComponent', () => {
  let component: IncomeBreakdownChartComponent;
  let fixture: ComponentFixture<IncomeBreakdownChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeBreakdownChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeBreakdownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
