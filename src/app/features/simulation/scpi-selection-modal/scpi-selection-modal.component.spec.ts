import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiSelectionModalComponent } from './scpi-selection-modal.component';

describe('ScpiSelectionModalComponent', () => {
  let component: ScpiSelectionModalComponent;
  let fixture: ComponentFixture<ScpiSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
