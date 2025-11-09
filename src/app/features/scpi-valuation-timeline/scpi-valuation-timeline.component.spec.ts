import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScpiValuationTimelineComponent } from './scpi-valuation-timeline.component';
import { ScpiDetail } from '../../models/scpi.model';
import { By } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { CommonModule, CurrencyPipe } from '@angular/common';

describe('ScpiValuationTimelineComponent', () => {
  let component: ScpiValuationTimelineComponent;
  let fixture: ComponentFixture<ScpiValuationTimelineComponent>;

  const mockScpi: ScpiDetail = {
    id: 1,
    name: 'Test SCPI',
    manager: 'Test Manager',
    capitalization: 1000000,
    sharePrice: 200,
    minimumSubscription: 1000,
    distributionRate: 4.5,
    subscriptionFees: 10,
    managementFees: 8,
    enjoymentDelay: '6 months',
    rentFrequency: 'Quarterly',
    advertising: 'Invest wisely',
    scpiPartValues: [
      { valuationYear: 2022, sharePrice: 200, reconstitutionValue: 199.95 },
      { valuationYear: 2023, sharePrice: 200, reconstitutionValue: 201.65 },
      { valuationYear: 2024, sharePrice: 200, reconstitutionValue: 205.37 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CurrencyPipe, TooltipModule, TimelineModule, ScpiValuationTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScpiValuationTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly map SCPI part values into sharePriceHistory and reconstitutionHistory', () => {
    component.scpi = mockScpi;
    component.ngOnChanges({
      scpi: {
        currentValue: mockScpi,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.sharePriceHistory.length).toBe(3);
    expect(component.reconstitutionHistory.length).toBe(3);

    expect(component.sharePriceHistory[0]).toEqual({ year: 2022, value: 200 });
    expect(component.reconstitutionHistory[2]).toEqual({ year: 2024, value: 205.37 });
  });

  it('should display two timelines when multiple years are available', () => {
    component.scpi = mockScpi;
    component.ngOnChanges({
      scpi: {
        currentValue: mockScpi,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    fixture.detectChanges();

    const timelines = fixture.debugElement.queryAll(By.css('p-timeline'));
    expect(timelines.length).toBe(2); // One for share price, one for reconstitution value
  });

  it('should display a single value when only one year is available', () => {
    const singleYearScpi: ScpiDetail = {
      ...mockScpi,
      scpiPartValues: [{ valuationYear: 2024, sharePrice: 210, reconstitutionValue: 215 }],
    };

    component.scpi = singleYearScpi;
    component.ngOnChanges({
      scpi: {
        currentValue: singleYearScpi,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    fixture.detectChanges();

    const singleValueElements = fixture.debugElement.queryAll(By.css('.single-value .value'));
    expect(singleValueElements.length).toBe(2);
    expect(singleValueElements[0].nativeElement.textContent).toContain('€210.00');
    expect(singleValueElements[1].nativeElement.textContent).toContain('€215.00');
  });

  it('should sort SCPI part values in ascending year order', () => {
    const unsortedScpi: ScpiDetail = {
      ...mockScpi,
      scpiPartValues: [
        { valuationYear: 2024, sharePrice: 210, reconstitutionValue: 205 },
        { valuationYear: 2022, sharePrice: 190, reconstitutionValue: 195 },
        { valuationYear: 2023, sharePrice: 200, reconstitutionValue: 200 },
      ],
    };

    component.scpi = unsortedScpi;
    component.ngOnChanges({
      scpi: {
        currentValue: unsortedScpi,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.sharePriceHistory.map(v => v.year)).toEqual([2022, 2023, 2024]);
  });
});
