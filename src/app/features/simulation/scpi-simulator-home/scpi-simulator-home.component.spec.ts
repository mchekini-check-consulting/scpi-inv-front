import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiSimulatorHomeComponent } from './scpi-simulator-home.component';

describe('ScpiSimulatorHomeComponent', () => {
  let component: ScpiSimulatorHomeComponent;
  let fixture: ComponentFixture<ScpiSimulatorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiSimulatorHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiSimulatorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
