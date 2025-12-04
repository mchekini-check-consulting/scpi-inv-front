import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  CountryData,
  PortfolioItem,
  ScpiSimulator,
  SimulationResponseDTO,
  SimulationSummary
} from '../models/scpi-simulator.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationStateService {

  private readonly DEFAULT_TMI = 30;
  private portfolioSubject = new BehaviorSubject<PortfolioItem[]>([]);
  portfolio$ = this.portfolioSubject.asObservable();
  private countriesSubject = new BehaviorSubject<CountryData[]>([]);
  countries$ = this.countriesSubject.asObservable();

  private sectorsSubject = new BehaviorSubject<{ label: string; percentage: number }[]>([]);
  sectors$ = this.sectorsSubject.asObservable();


  private summarySubject = new BehaviorSubject<SimulationSummary>({
    id: null,
    name: 'Nouvelle simulation',
    totalInvestment: 0,
    grossRevenue: 0,
    netRevenue: 0,
    totalScpis: 0,
    taxRate: this.DEFAULT_TMI
  });
  summary$ = this.summarySubject.asObservable();

  getPortfolioSnapshot(): PortfolioItem[] {
    return this.portfolioSubject.getValue();
  }

  getSummarySnapshot(): SimulationSummary {
    return this.summarySubject.getValue();
  }

  getCountriesSnapshot(): CountryData[] {
    return this.countriesSubject.getValue();
  }

  loadSimulation(sim: any): void {
    const portfolio: PortfolioItem[] = sim.items.map((item: any) => ({
      id: item.id,
      scpi: item.scpi,
      shares: item.shares,
      amount: item.amount,
      annualReturn: item.annualReturn
    }));

    this.portfolioSubject.next(portfolio);

    this.summarySubject.next({
      id: sim.id,
      name: sim.name,
      totalInvestment: sim.totalInvestment,
      grossRevenue: sim.totalAnnualReturn,
      netRevenue: sim.netRevenue ?? sim.totalAnnualReturn,
      totalScpis: portfolio.length,
      taxRate: sim.taxRate ?? this.DEFAULT_TMI
    });
  }

  setSimulationName(name: string): void {
    const summary = this.summarySubject.getValue();
    this.summarySubject.next({ ...summary, name });
  }

  addOrUpdateScpi(scpi: ScpiSimulator, shares: number): void {
    const portfolio = [...this.portfolioSubject.getValue()];
    const existing = portfolio.find(p => p.scpi.id === scpi.id);

    const sharePrice = scpi.sharePrice ?? 0;
    const yieldRate = scpi.yieldDistributionRate ?? 0;

    const amount = shares * sharePrice;
    const annualReturn = amount * (yieldRate / 100);

    if (existing) {
      existing.shares = shares;
      existing.amount = amount;
      existing.annualReturn = annualReturn;
    } else {
      portfolio.push({
        id: `temp-${scpi.id}`,
        scpi,
        shares,
        amount,
        annualReturn
      });
    }

    this.portfolioSubject.next(portfolio);
    this.calculateCountries(portfolio);
    this.calculateSectors(portfolio);
    this.recomputeSummary();

    this.savePortfolioToLocalStorage();
  }

updateShares(scpiId: number, newShares: number) {
  const current = this.portfolioSubject.getValue();
  const updated = current.map(item => {
    if (item.scpi.id !== scpiId) return item;

    const sharePrice = item.scpi.sharePrice ?? 0;
    const annualRate = item.scpi.yieldDistributionRate ?? 0;

    const newAmount = newShares * sharePrice;
    const newAnnualReturn = newAmount * (annualRate / 100);

    return {
      ...item,
      shares: newShares,
      amount: newAmount,
      annualReturn: newAnnualReturn
    };
  });

  this.portfolioSubject.next(updated);
  this.calculateCountries(updated);
  this.calculateSectors(updated);
  this.recalculateSummary();  
  this.savePortfolioToLocalStorage();
}

recalculateSummary() {
  const portfolio = this.portfolioSubject.value ?? [];

  let totalInvestment = 0;
  let grossRevenue = 0;

  portfolio.forEach(item => {
    totalInvestment += item.amount ?? 0;
    grossRevenue += item.annualReturn ?? 0;
  });

  const previousSummary = this.summarySubject.value ?? {};

  const taxRate = previousSummary.taxRate ?? 0;
  const incomeTax = -(grossRevenue * (taxRate / 100));
  const socialTax = -(grossRevenue * 0.172);
  const netRevenue = grossRevenue + incomeTax + socialTax;

  const summary: SimulationSummary = {
    id: previousSummary.id ?? null,
    name: previousSummary.name ?? 'Nouvelle simulation',
    totalInvestment,
    grossRevenue,
    netRevenue,
    totalScpis: portfolio.length,
    taxRate
  };

  this.summarySubject.next(summary);
}

  
  removeScpi(scpiId: number | string): void {
    const idToRemove = Number(scpiId);
    const current = this.portfolioSubject.getValue() || [];
    const updated = current.filter(item => Number(item.scpi.id) !== idToRemove);

    this.portfolioSubject.next([...updated]);

    this.calculateSectors(updated);
    this.calculateCountries(updated);
    this.recomputeSummary();
    this.savePortfolioToLocalStorage();
  }



  setTmi(tmi: number): void {
    const summary = this.summarySubject.getValue();
    this.summarySubject.next({ ...summary, taxRate: tmi });
    this.recomputeSummary();
  }

  resetSimulation(): void {
    this.portfolioSubject.next([]);
    this.countriesSubject.next([]);
    this.sectorsSubject.next([]);
    this.summarySubject.next({
      id: null,
      name: 'Nouvelle simulation',
      totalInvestment: 0,
      grossRevenue: 0,
      netRevenue: 0,
      totalScpis: 0,
      taxRate: this.DEFAULT_TMI
    });
  }

  private recomputeSummary(): void {
    const portfolio = this.portfolioSubject.getValue();
    const current = this.summarySubject.getValue();

    const totalInvestment = portfolio.reduce((s, i) => s + i.amount, 0);
    const grossRevenue = portfolio.reduce((s, i) => s + i.annualReturn, 0);
    const totalScpis = portfolio.length;

    const tmi = current.taxRate;

    const incomeTax = -(grossRevenue * (tmi / 100));
    const socialTax = -(grossRevenue * 0.172);
    const netRevenue = grossRevenue + incomeTax + socialTax;

    this.summarySubject.next({
      ...current,
      totalInvestment,
      grossRevenue,
      netRevenue,
      totalScpis
    });
  }

  setSimulationId(id: number) {
  const current = this.summarySubject.getValue();
  this.summarySubject.next({ ...current, id });
}

 setSimulationFromResponseDTO(sim: SimulationResponseDTO) {
  const portfolio: PortfolioItem[] = sim.items.map(i => ({
    id: i.scpiId.toString(),
    scpi: {
      id: i.scpiId,
      name: i.scpiName,
      yieldDistributionRate: 0,
      sharePrice: 0,
      minimumSubscription: 0,
      sectors: [],
      locations:  [] 
    },
    shares: i.shares,
    amount: i.amount,
    annualReturn: i.annualReturn
  }));

  const summary: SimulationSummary = {
    id: sim.id,
    name: sim.name,
    totalInvestment: sim.totalInvestment,
    grossRevenue: sim.totalAnnualReturn,
    netRevenue: sim.totalAnnualReturn,
    totalScpis: portfolio.length,
    taxRate: 30 
  };

  this.portfolioSubject.next(portfolio);
  this.summarySubject.next(summary);
  this.calculateCountries(portfolio);
}

private calculateCountries(portfolio: PortfolioItem[]): void {
  if (!portfolio?.length) {
    this.countriesSubject.next([]);
    return;
  }

  const countryAmountMap = new Map<string, number>();
  let totalPortfolioAmount = 0;

  portfolio.forEach(item => {
    totalPortfolioAmount += item.amount;
    const locations = item.scpi.locations ?? [];

    locations.forEach(loc => {
      const percentage = Number(loc.percentage);
      if (isNaN(percentage) || percentage <= 0) return;

      const allocatedAmount = item.amount * (percentage / 100);
      const current = countryAmountMap.get(loc.label) ?? 0;
      countryAmountMap.set(loc.label, current + allocatedAmount);
    });
  });

  if (countryAmountMap.size === 0) {
    this.countriesSubject.next([]);
    return;
  }

  const countries = Array.from(countryAmountMap.entries()).map(([countryName, amount]) => {
    const portfolioPercentage = (amount / totalPortfolioAmount) * 100;
    
    return {
      name: countryName,
      label: countryName,
      amount: Math.round(amount),
      percentage: Number(portfolioPercentage.toFixed(2)),
      value: Number(portfolioPercentage.toFixed(2))
    };
  });

  const sortedCountries = countries.sort((a, b) => b.percentage - a.percentage);
  this.countriesSubject.next(sortedCountries);
}

  private calculateSectors(portfolio: PortfolioItem[]): void {
  if (!portfolio?.length) {
    this.sectorsSubject.next([]);
    return;
  }

  const sectorMap = new Map<string, number>();
  let totalAmount = 0;

  portfolio.forEach(item => {
    const amount = Number(item.amount) || 0;
    totalAmount += amount;

    (item.scpi.sectors ?? []).forEach(sec => {
      const percentage = Number(sec.percentage) || 0;
      const allocatedAmount = amount * (percentage / 100);

      const current = sectorMap.get(sec.label) ?? 0;
      sectorMap.set(sec.label, current + allocatedAmount);
    });
  });

  if (totalAmount === 0) {
    this.sectorsSubject.next([]);
    return;
  }

  const sectors = Array.from(sectorMap.entries()).map(([label, amount]) => ({
    label,
    percentage: Number(((amount / totalAmount) * 100).toFixed(2))
  }));

  this.sectorsSubject.next([...sectors].sort((a, b) => b.percentage - a.percentage));
}

private savePortfolioToLocalStorage(): void {
  const portfolio = this.getPortfolioSnapshot();
  localStorage.setItem('unsavedPortfolio', JSON.stringify(portfolio));
}
public loadUnsavedPortfolio(portfolio: PortfolioItem[]): void {
  this.portfolioSubject.next(portfolio);
  this.calculateCountries(portfolio);
  this.calculateSectors(portfolio);
  this.recomputeSummary();
}
public resetSimulationState(): void {
  this.resetSimulation(); 
  localStorage.removeItem('unsavedPortfolio'); 
  localStorage.removeItem('currentSimulationId');
}

}


