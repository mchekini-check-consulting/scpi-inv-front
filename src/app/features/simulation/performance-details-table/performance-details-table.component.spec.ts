import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDetailsTableComponent } from './performance-details-table.component';

describe('PerformanceDetailsTableComponent', () => {
  let component: PerformanceDetailsTableComponent;
  let fixture: ComponentFixture<PerformanceDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDetailsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
