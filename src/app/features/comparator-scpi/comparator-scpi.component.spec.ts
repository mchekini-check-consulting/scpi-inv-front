import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatorScpiComponent } from './comparator-scpi.component';

describe('ComparatorScpiComponent', () => {
  let component: ComparatorScpiComponent;
  let fixture: ComponentFixture<ComparatorScpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparatorScpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparatorScpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
