import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceHistoryComponent } from './performance-history.component';

describe('PerformanceHistoryComponent', () => {
  let component: PerformanceHistoryComponent;
  let fixture: ComponentFixture<PerformanceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
