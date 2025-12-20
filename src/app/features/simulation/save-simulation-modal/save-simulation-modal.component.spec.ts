import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSimulationModalComponent } from './save-simulation-modal.component';

describe('SaveSimulationModalComponent', () => {
  let component: SaveSimulationModalComponent;
  let fixture: ComponentFixture<SaveSimulationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveSimulationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveSimulationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
