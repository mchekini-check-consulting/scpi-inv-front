import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleScpiComponent } from './portefeuille-scpi.component';

describe('PortefeuilleScpiComponent', () => {
  let component: PortefeuilleScpiComponent;
  let fixture: ComponentFixture<PortefeuilleScpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortefeuilleScpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleScpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
