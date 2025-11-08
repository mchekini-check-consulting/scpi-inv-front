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

