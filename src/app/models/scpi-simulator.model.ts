import { RepartitionItem } from "./scpi-repartition.model"

export interface ScpiSimulator {
  id: number
  name: string
  yieldDistributionRate: number
  sharePrice: number
  minimumSubscription: number
  sectors: RepartitionItem[]
}

export interface PortfolioItem {
  id: string
  scpi: ScpiSimulator
  shares: number
  amount: number
  annualReturn: number
}

export interface SimulationSummary {
  totalInvestment: number
  grossRevenue: number
  netRevenue: number
  totalScpis: number
  taxRate: number
}

export interface SectorDistribution {
  sector: string
  amount: number
  percentage: number
  color: string
}

export interface PerformanceDetail {
  scpiName: string
  sector: string
  shares: number
  amount: number
  rate: number
  annualRevenue: number
}
