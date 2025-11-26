import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiSimulatorComponent } from './scpi-simulator.component';

describe('ScpiSimulatorComponent', () => {
  let component: ScpiSimulatorComponent;
  let fixture: ComponentFixture<ScpiSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
