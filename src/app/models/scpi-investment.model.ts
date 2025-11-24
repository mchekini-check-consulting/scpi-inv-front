import { ScpiDismembrement } from './scpi-dismembrement.model';

export interface ScpiInvestment {
  id: number;
  name: string;
  sharePrice: number;
  distributionRate: number;
  minimumSubscription: number;
  dismembermentActive: boolean;
  scpiDismembrement: ScpiDismembrement[];

  hasInvested: boolean;
  totalInvestedAmount: number;
}

export interface InvestmentResponse {
  id: number;
  investmentAmount: number;
  numberOfShares: number;
  investmentType: 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT';
  dismembermentYears: number | null;
  investmentDate: string;
  scpiId: number;
  scpiName: string;
  scpiType: string;
  sharePrice: number;
}

export interface PortfolioSummary {
  totalInvestedAmount: number;
  totalInvestments: number;
  totalScpis: number;
  investments: InvestmentResponse[];
}
