import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiValuationTimelineComponent } from './scpi-valuation-timeline.component';

describe('ScpiValuationTimelineComponent', () => {
  let component: ScpiValuationTimelineComponent;
  let fixture: ComponentFixture<ScpiValuationTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiValuationTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiValuationTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
