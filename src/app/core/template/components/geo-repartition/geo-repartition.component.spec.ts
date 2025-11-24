import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoRepartitionComponent } from './geo-repartition.component';

describe('GeoRepartitionComponent', () => {
  let component: GeoRepartitionComponent;
  let fixture: ComponentFixture<GeoRepartitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoRepartitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoRepartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
