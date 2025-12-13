import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartModule } from 'primeng/chart';
import { CurrencyPipe } from '@angular/common';
import {ScpiValuationGraphComponent} from "./scpi-valuation-graph.component";
import {ScpiDetail} from "../../core/model/scpi.model";

describe('ScpiValuationTimelineComponent', () => {
  let component: ScpiValuationGraphComponent;
  let fixture: ComponentFixture<ScpiValuationGraphComponent>;

  const mockScpi: ScpiDetail = {
    scpiPartValues: [
      { valuationYear: 2020, sharePrice: 200, reconstitutionValue: 210 },
      { valuationYear: 2021, sharePrice: 202, reconstitutionValue: 212 },
      { valuationYear: 2022, sharePrice: 204, reconstitutionValue: 215 }
    ]
  } as ScpiDetail;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartModule],
      declarations: [ScpiValuationGraphComponent],
      providers: [CurrencyPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(ScpiValuationGraphComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate chartData and chartOptions on input change', () => {
    component.scpi = mockScpi;
    component.ngOnChanges({
      scpi: {
        currentValue: mockScpi,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.chartData).toBeDefined();
    expect(component.chartData.labels).toEqual(['2020', '2021', '2022']);
    expect(component.chartData.datasets.length).toBe(2);

    const [sharePriceDataset, reconstitutionDataset] = component.chartData.datasets;

    expect(sharePriceDataset.label).toBe('Prix de part');
    expect(sharePriceDataset.data).toEqual([200, 202, 204]);

    expect(reconstitutionDataset.label).toBe('Valeur de reconstitution');
    expect(reconstitutionDataset.data).toEqual([210, 212, 215]);

    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions.plugins.legend.position).toBe('bottom');
  });

});
