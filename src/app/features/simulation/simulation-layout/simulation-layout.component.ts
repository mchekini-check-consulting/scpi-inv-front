
import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ScpiSimulator, SimulationSummary } from "../../../models/scpi-simulator.model"
import { ScpiService } from "../../../services/scpi.service"
import { PortfolioManagementComponent } from "../portfolio-management/portfolio-management.component";
import { SectorChartComponent } from "../sector-chart/sector-chart.component";
import { IncomeBreakdownChartComponent } from "../income-breakdown-chart/income-breakdown-chart.component";
import { GeographicChartComponent } from "../geographic-chart/geographic-chart.component";
import { PerformanceDetailsTableComponent } from "../performance-details-table/performance-details-table.component";
import { TaxSectionComponent } from "../tax-section/tax-section.component";
import { ScpiSelectionModalComponent } from "../scpi-selection-modal/scpi-selection-modal.component";


@Component({
  selector: "app-simulation-layout",
  standalone: true,
  imports: [CommonModule, PortfolioManagementComponent, TaxSectionComponent, SectorChartComponent, IncomeBreakdownChartComponent, GeographicChartComponent, PerformanceDetailsTableComponent, ScpiSelectionModalComponent],
  templateUrl: "./simulation-layout.component.html",
  styleUrl: "./simulation-layout.component.scss",
})
export class SimulationLayoutComponent implements OnInit {

  summary: SimulationSummary = {
    totalInvestment: 0,
    grossRevenue: 0,
    netRevenue: 0,
    totalScpis: 0,
    taxRate: 30,
  }
    showAddModal: boolean = false;
  constructor(private scpiService: ScpiService) {}
    addToPortfolio(event: { scpi: ScpiSimulator, shares: number }) {

        console.log("SCPI à ajouter:", event.scpi.name, "Parts:", event.shares);
        this.onOpenAddModal(false);
      }
  ngOnInit(): void {
    this.scpiService.portfolio$.subscribe(() => {
      this.updateSummary()
    })
  }

  private updateSummary(): void {
    this.summary = this.scpiService.getSummary()
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  onOpenAddModal(isOpen: boolean): void {
    this.showAddModal = isOpen;
  }
}