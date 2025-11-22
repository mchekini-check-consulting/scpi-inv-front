import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationNewComponent } from './simulation-new.component';

describe('SimulationNewComponent', () => {
  let component: SimulationNewComponent;
  let fixture: ComponentFixture<SimulationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
