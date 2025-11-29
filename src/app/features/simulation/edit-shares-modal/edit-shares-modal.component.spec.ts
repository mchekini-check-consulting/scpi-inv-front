import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSharesModalComponent } from './edit-shares-modal.component';

describe('EditSharesModalComponent', () => {
  let component: EditSharesModalComponent;
  let fixture: ComponentFixture<EditSharesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSharesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSharesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
