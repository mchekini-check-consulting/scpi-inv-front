import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiRepartitionComponent } from './scpi-repartition.component';

describe('ScpiRepartitionComponent', () => {
  let component: ScpiRepartitionComponent;
  let fixture: ComponentFixture<ScpiRepartitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiRepartitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiRepartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
