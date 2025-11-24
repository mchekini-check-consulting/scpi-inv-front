import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectoralRepartitionComponent } from './sectoral-repartition.component';

describe('ScpiRepartitionComponent', () => {
  let component: SectoralRepartitionComponent;
  let fixture: ComponentFixture<SectoralRepartitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectoralRepartitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectoralRepartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
