
import { Component, type OnInit, Output, EventEmitter, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ScpiService } from "../../../core/service/scpi.service"
import { RepartitionItem } from "../../../core/model/scpi-repartition.model"
import { ScpiSimulator } from "../../../core/model/scpi-simulator.model"
import { FormatFieldPipe } from "../../../core/pipe/format-field.pipe";

@Component({
 selector: "app-scpi-selection-modal",
 standalone: true,
 imports: [CommonModule, FormsModule, FormatFieldPipe],
 templateUrl: "./scpi-selection-modal.component.html",
 styleUrl: "./scpi-selection-modal.component.scss",
})
export class ScpiSelectionModalComponent implements OnInit {
 @Output() close = new EventEmitter<void>()
 @Output() addScpi = new EventEmitter<{ scpi: ScpiSimulator, shares: number }>()

 scpiList: ScpiSimulator[] = []
 filteredList: ScpiSimulator[] = []
 selectedScpi: ScpiSimulator | null = null
 shares = 1
 searchTerm = ""
 step: "selection" | "configuration" = "selection"
 Math = Math;
 @Input() selectedIds: number[] = [];


 constructor(private scpiService: ScpiService) {}

 ngOnInit(): void {
  this.scpiService.getScpiForSimulator().subscribe((scpis) => {
   this.scpiList = scpis;
   this.filteredList = scpis;
       this.filteredList = this.scpiList.filter(
      scpi => !this.selectedIds.includes(scpi.id)
    );
  })
 }

  filterScpis(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredList = this.scpiList
      .filter(scpi =>
        !this.selectedIds.includes(scpi.id) && (
          scpi.name.toLowerCase().includes(term) ||
          scpi.sectors.some((s) => s.label.toLowerCase().includes(term))
        )
      );
  }


 selectScpi(scpi: ScpiSimulator): void {
  this.selectedScpi = scpi

  const sharePrice = scpi.sharePrice ?? 0;
  const minSubscription = scpi.minimumSubscription ?? 0;

  const minShares = sharePrice > 0 ? Math.ceil(minSubscription / sharePrice) : 1;
  this.shares = minShares;

  this.step = "configuration"
 }

 backToSelection(): void {
  this.step = "selection"
  this.selectedScpi = null
  this.shares = 1
 }

 getTotalAmount(): number {
  if (!this.selectedScpi || this.shares < 0) return 0
  return this.shares * this.selectedScpi.sharePrice
 }

 confirmAdd(): void {
  if (this.selectedScpi) {
   this.addScpi.emit({ scpi: this.selectedScpi, shares: this.shares })
   this.close.emit()
  }
 }


 getPrimarySector(sectors: RepartitionItem[]): string {
  if (!sectors || sectors.length === 0) return "Autre"
  const primary = sectors.reduce((prev, current) => (current.percentage > prev.percentage ? current : prev))
  return primary.label
 }

 getSectorColor(sector: string): string {
  const colors: { [key: string]: string } = {
   Santé: "#10b981", Bureaux: "#3b82f6", Commerces: "#f59e0b", Commerce: "#f59e0b",
   Residentiel: "#8b5cf6", Résidentiel: "#8b5cf6", Logistique: "#ef4444",
   Hotels: "#06b6d4", Hôtellerie: "#06b6d4", Locaux: "#64748b",
   "Locaux d'activite": "#94a3b8", Transport: "#f97316", Autre: "#6b7280", Autres: "#6b7280",
  }
  return colors[sector] || "#64748b"
 }

 formatSectors(sectors: RepartitionItem[]): string {
  if (!sectors || sectors.length === 0) return "N/A"
  return sectors
   .map((s) => `${s.label} (${s.percentage}%)`)
   .join(", ")
 }
}
