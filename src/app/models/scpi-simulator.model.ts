import { RepartitionItem } from "./scpi-repartition.model";

export interface ScpiSimulator {
  id: number;
  name: string;
  yieldDistributionRate: number;
  sharePrice: number;
  minimumSubscription: number;
  sectors: RepartitionItem[];
  locations?: Location[];
}

export interface PortfolioItem {
  id: string; 
  scpi: ScpiSimulator;
  shares: number;
  amount: number;
  annualReturn: number;
  locations?: Location[];
}

export interface SimulationSummary {
  id: number | null;
  name: string;
  totalInvestment: number;
  grossRevenue: number;
  netRevenue: number;
  totalScpis: number;
  taxRate: number;
}

export interface SimulationScpiDTO {
  scpiId: number;
  shares: number;
}

export interface SimulationScpiResponseDTO {
  id: number; 
  scpiId: number;
  scpiName: string;
  shares: number;
  amount: number;
  annualReturn: number;
}

export interface SimulationDTORequest {
  name: string;
  scpis: SimulationScpiDTO[];
}

export interface SimulationDTOResponse {
  id: number;
  name: string;
  createdAt: string;
  scpis: SimulationScpiResponseDTO[];
  totalInvestment: number;
  grossRevenue: number;
  netRevenue: number;
}

export interface SimulationResponseDTO {
  id: number;
  name: string;
  totalInvestment: number;
  totalAnnualReturn: number;
  items: SimulationScpiResponseDTO[];
}

export interface SectorDistribution {
  sector: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface PerformanceDetail {
  scpiName: string;
  sector: string;
  shares: number;
  amount: number;
  rate: number;
  annualRevenue: number;
}

export interface Location {
  label: string;       
  percentage: number;
}

export interface CountryData {
  name: string;
  label: string;
  amount: number;
  percentage: number;
  value: number;
}