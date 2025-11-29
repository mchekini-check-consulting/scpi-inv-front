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
  scpiManagerName: string;
  scpiType: string;
  sharePrice: number;
}

export interface PortfolioSummary {
  totalInvestedAmount: number;
  totalInvestments: number;
  totalScpis: number;
  investments: InvestmentResponse[];
}

export interface RepartitionItem {
  label: string;
  percentage: number;
}

export interface InvestorPortfolioDistribution {
  totalInvestedAmount: number;
  sectoral: RepartitionItem[];
  geographical: RepartitionItem[];
}
