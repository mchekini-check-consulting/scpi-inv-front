import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontantTotalInvestiComponent } from './montant-total-investi.component';

describe('MontantTotalInvestiComponent', () => {
  let component: MontantTotalInvestiComponent;
  let fixture: ComponentFixture<MontantTotalInvestiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontantTotalInvestiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontantTotalInvestiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
