import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionSectorielleComponent } from './repartition-sectorielle.component';

describe('RepartitionSectorielleComponent', () => {
  let component: RepartitionSectorielleComponent;
  let fixture: ComponentFixture<RepartitionSectorielleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartitionSectorielleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepartitionSectorielleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
