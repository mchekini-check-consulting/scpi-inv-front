import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationLayoutComponent } from './simulation-layout.component';

describe('SimulationLayoutComponent', () => {
  let component: SimulationLayoutComponent;
  let fixture: ComponentFixture<SimulationLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
