import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiCatalogComponent } from './scpi-catalog.component';

describe('ScpiCatalogComponent', () => {
  let component: ScpiCatalogComponent;
  let fixture: ComponentFixture<ScpiCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
