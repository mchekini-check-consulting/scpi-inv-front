import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiDetailComponent } from './scpi-detail.component';

describe('ScpiDetailComponent', () => {
  let component: ScpiDetailComponent;
  let fixture: ComponentFixture<ScpiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
