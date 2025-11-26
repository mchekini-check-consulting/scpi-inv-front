import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInvestissementsComponent } from './liste-investissements.component';

describe('ListeInvestissementsComponent', () => {
  let component: ListeInvestissementsComponent;
  let fixture: ComponentFixture<ListeInvestissementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeInvestissementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeInvestissementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
