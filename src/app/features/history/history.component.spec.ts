import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from '../../services/history.service';
import { of, throwError } from 'rxjs';
import { History } from '../../models/history.model';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let mockHistoryService: jasmine.SpyObj<HistoryService>;

  const mockHistories: History[] = [
    { investmentId: 1, modificationDate: new Date('2023-10-01'), creationDate :new Date('2023-10-01'), status: 'SUCCESS' },
    { investmentId: 2, modificationDate: new Date('2023-10-02'), creationDate :new Date('2023-10-02'),status: 'FAILED' },
    { investmentId: 3, modificationDate: new Date('2023-10-03'), creationDate :new Date('2023-10-03'),status: 'PENDING' },
  ];

  beforeEach(waitForAsync(() => {
    mockHistoryService = jasmine.createSpyObj('HistoryService', ['getHistory']);

    TestBed.configureTestingModule({
      imports: [CommonModule, TableModule, DropdownModule, ButtonModule, FormsModule],
      declarations: [HistoryComponent],
      providers: [{ provide: HistoryService, useValue: mockHistoryService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load histories on init', () => {
    mockHistoryService.getHistory.and.returnValue(of(mockHistories));

    fixture.detectChanges();

    expect(component.histories.length).toBe(3);
    expect(component.filteredHistories.length).toBe(3);
    expect(component.error).toBeUndefined();
  });

  it('should filter histories by status', () => {
    mockHistoryService.getHistory.and.returnValue(of(mockHistories));
    fixture.detectChanges();

    component.selectedStatus = 'FAILED';
    component.filterByStatus();

    expect(component.filteredHistories.length).toBe(1);
    expect(component.filteredHistories[0].status).toBe('FAILED');
  });

  it('should reset filter when status is ALL', () => {
    mockHistoryService.getHistory.and.returnValue(of(mockHistories));
    fixture.detectChanges();

    component.selectedStatus = 'ALL';
    component.filterByStatus();

    expect(component.filteredHistories.length).toBe(3);
  });

  it('should handle error during data fetch', () => {
    mockHistoryService.getHistory.and.returnValue(throwError(() => new Error('API error')));
    fixture.detectChanges();

    expect(component.error).toContain('Erreur lors du chargement');
    expect(component.histories.length).toBe(0);
  });

  it('should return correct status label', () => {
    expect(component.getStatusLabel('SUCCESS')).toBe('Validée');
    expect(component.getStatusLabel('FAILED')).toBe('Rejetée');
    expect(component.getStatusLabel('PENDING')).toBe('En cours');
    expect(component.getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});
