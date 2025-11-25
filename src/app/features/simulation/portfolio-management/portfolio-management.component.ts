
import { Component, type OnInit, Output, EventEmitter } from "@angular/core" 
import { CommonModule } from "@angular/common"
import { PortfolioItem, ScpiSimulator } from "../../../models/scpi-simulator.model" 
import { ScpiService } from "../../../services/scpi.service" 
import { RepartitionItem } from "../../../models/scpi-repartition.model"
import { ScpiSelectionModalComponent } from "../scpi-selection-modal/scpi-selection-modal.component";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";

@Component({
selector: "app-portfolio-management",
standalone: true,
imports: [CommonModule, ScpiSelectionModalComponent, ConfirmationModalComponent],
templateUrl: "./portfolio-management.component.html",
styleUrl: "./portfolio-management.component.scss",
})
export class PortfolioManagementComponent implements OnInit {

@Output() portfolioUpdated = new EventEmitter<PortfolioItem[]>(); 

portfolio: PortfolioItem[] = [] 
totalInvestment = 0
showAddModal = false
itemToDelete: string | null = null
Math = Math; 

constructor(private scpiService: ScpiService) {}

ngOnInit(): void {
this.calculateTotal()
}

private calculateTotal(): void {
this.totalInvestment = this.portfolio.reduce((sum, item) => sum + item.amount, 0)
}

addToPortfolio(event: { scpi: ScpiSimulator, shares: number }): void {
const { scpi, shares } = event;
    const existingItem = this.portfolio.find(item => item.scpi.id === scpi.id);

const sharePrice = scpi.sharePrice; 
const yieldRate = scpi.yieldDistributionRate;
    let updatedPortfolio: PortfolioItem[];
    
    if (existingItem) {
      
        const amount = shares * sharePrice;
        const annualReturn = amount * (yieldRate / 100);

        updatedPortfolio = this.portfolio.map(item => {
            if (item.scpi.id === scpi.id) {
                return {
                    ...item, 
                    shares: shares,
                    amount: amount, 
                    annualReturn: annualReturn
                };
            }
            return item;
        });

    } else {
        const amount = shares * sharePrice;
        const annualReturn = amount * (yieldRate / 100);

        const newItem: PortfolioItem = {
            id: `scpi-${scpi.id}`, 
            scpi: scpi,
            shares: shares,
            amount: amount,
            annualReturn: annualReturn,
        };
        updatedPortfolio = [...this.portfolio, newItem];
    }
    
this.portfolio = updatedPortfolio; 
this.calculateTotal();
this.portfolioUpdated.emit(this.portfolio); 
this.closeAddModal();
}

openAddModal(): void {
this.showAddModal = true
}

closeAddModal(): void {
this.showAddModal = false
}


incrementShares(id: string): void {
const item = this.portfolio.find((p) => p.id === id)
if (item) {
 const newShares = item.shares + 1
 this.updatePortfolioItemShares(id, newShares)
}
}

decrementShares(id: string): void {
const item = this.portfolio.find((p) => p.id === id)
if (item) {
 const sharePrice = item.scpi.sharePrice
 const minShares = sharePrice > 0 ? Math.ceil((item.scpi.minimumSubscription) / sharePrice) : 1 
 
 if (item.shares > minShares) {
const newShares = item.shares - 1
this.updatePortfolioItemShares(id, newShares)
 }
}
}

private updatePortfolioItemShares(id: string, shares: number): void {
this.portfolio = this.portfolio.map((item) => { 
 if (item.id === id) {
const sharePrice = item.scpi.sharePrice 
const yieldRate = item.scpi.yieldDistributionRate

const amount = shares * sharePrice
const annualReturn = amount * (yieldRate / 100)

return { ...item, shares, amount, annualReturn }
 }
 return item
})
 this.calculateTotal();
this.portfolioUpdated.emit(this.portfolio);
 }

confirmDelete(id: string): void {
 this.itemToDelete = id
 }

cancelDelete(): void {
 this.itemToDelete = null
 }

 deleteItem(): void {
if (this.itemToDelete) {
 this.portfolio = this.portfolio.filter((item) => item.id !== this.itemToDelete) 
 this.calculateTotal(); 
      this.portfolioUpdated.emit(this.portfolio); 
 this.itemToDelete = null
}
 }

formatCurrency(value: number): string {
 return new Intl.NumberFormat("fr-FR", {
 style: "currency",
 currency: "EUR",
 minimumFractionDigits: 0,
 maximumFractionDigits: 0,
}).format(value)
}

 getPrimarySector(sectors: RepartitionItem[]): string {
if (!sectors || sectors.length === 0) return "Autre"
 const primary = sectors.reduce((prev, current) => (current.percentage > prev.percentage ? current : prev))
 return primary.label
}
formatPercentage(value: number): string {

return value.toFixed(2).replace('.', ',') + ' %';
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
}