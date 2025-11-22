import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenusmensuelsComponent } from './revenusmensuels.component';

describe('RevenusmensuelsComponent', () => {
  let component: RevenusmensuelsComponent;
  let fixture: ComponentFixture<RevenusmensuelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenusmensuelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenusmensuelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
