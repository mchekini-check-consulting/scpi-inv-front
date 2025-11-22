import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioScpisComponent } from './portfolio-scpis.component';

describe('PortfolioScpisComponent', () => {
  let component: PortfolioScpisComponent;
  let fixture: ComponentFixture<PortfolioScpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioScpisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioScpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
