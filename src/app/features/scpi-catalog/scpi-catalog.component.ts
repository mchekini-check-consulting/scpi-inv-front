import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {ScpiService} from '../../core/service/scpi.service';

import {ScpiCardComponent} from '../../core/template/components/scpi-card/scpi-card.component';
import {Scpi} from '../../core/model/scpi.model';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SliderModule} from "primeng/slider";
import {MultiSelectModule} from "primeng/multiselect";
import {FormatFieldPipe} from "../../core/pipe/format-field.pipe";

@Component({
  selector: 'app-scpi-catalog',
  standalone: true,
  imports: [CommonModule, ScpiCardComponent, PaginatorModule, FormsModule, MultiSelectModule, SliderModule, FormatFieldPipe],
  templateUrl: './scpi-catalog.component.html',
  styleUrls: ['./scpi-catalog.component.scss'],
})
export class ScpiCatalogComponent implements OnInit {
  scpis: Scpi[] = [];
  isLoading = false;
  error: string | null = null;

  first = 0;
  rows = 20;
  totalRecords = 0;
  rowsPerPageOptions = [10, 20, 30];

  sectors: any[] = [];
  locations: any[] = [];
  rentFrequencies: any[] = [];

  filters: any = {
    countries: [],
    sectors: [],
    minimumSubscription: null,
    yield: null,
    rentFrequencies: []
  };

  constructor(
    private scpiService: ScpiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.scpiService.getScpiFiltersOptions().subscribe(value => {
      this.sectors = value.sectors;
      this.locations = value.locations;
      this.rentFrequencies = value.rentFrequencies;
    });

    this.route.queryParams.subscribe(params => {
      this.filters = { ...this.filters, ...params };
      this.loadScpis();
    });
  }

  loadScpis(): void {
    this.isLoading = true;
    this.error = null;

    const currentPage = Math.floor(this.first / this.rows);

    this.scpiService.getScpiPage(currentPage, this.rows, this.filters).subscribe({
      next: (response) => {
        this.scpis = response.content;
        this.totalRecords = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des SCPI';
        this.isLoading = false;
        console.error('Erreur:', err);
      },
    });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 20;
    this.loadScpis();
  }

  updateFilters(newFilters: any): void {
    this.filters = { ...this.filters, ...newFilters };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.filters,
      queryParamsHandling: 'merge'
    });
  }

  resetFilters(): void {
    this.filters =  {
      countries: [],
      sectors: [],
      minimumSubscription: null,
      yield: null,
      rentFrequencies: []
    };
    this.router.navigate([], { queryParams: {} });
    this.loadScpis();
  }

  removeCountry(country: string): void {
    this.filters.countries = this.filters.countries.filter((c:string) => c !== country);
    this.updateFilters({ countries: this.filters.countries });
  }

  removeSector(sector: string): void {
    this.filters.sectors = this.filters.sectors.filter((s:string) => s !== sector);
    this.updateFilters({ sectors: this.filters.sectors });
  }

  removeRentFrequency(freq: string): void {
    this.filters.rentFrequencies = this.filters.rentFrequencies.filter((f: string) => f !== freq);
    this.updateFilters({ rentFrequencies: this.filters.rentFrequencies });
  }
}

