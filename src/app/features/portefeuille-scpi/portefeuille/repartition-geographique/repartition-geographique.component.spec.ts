import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionGeographiqueComponent } from './repartition-geographique.component';

describe('RepartitionGeographiqueComponent', () => {
  let component: RepartitionGeographiqueComponent;
  let fixture: ComponentFixture<RepartitionGeographiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartitionGeographiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepartitionGeographiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
