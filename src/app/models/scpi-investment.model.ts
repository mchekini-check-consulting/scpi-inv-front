import { ScpiDismembrement } from './scpi-dismembrement.model';

export interface ScpiInvestment {
  id: number;
  name: string;
  minimumSubscription: number;
  sharePrice: number;
  dismembermentActive: boolean;
  distributionRate: number;
  scpiDismembrement: ScpiDismembrement[];
}
