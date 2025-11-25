import { DistributionRate } from "./distribution-rate.model";

export interface Scpi {
  id: number;
  name: string;
  manager:string;
  imageUrl: string | null;
  minimumSubscription: number;
  country: string;
  cashback: number;
  advertising: string;
  distributionRate: number;
}

export interface ScpiPage {
  data: Scpi[];
  total: number;
  page: number;
  pageSize: number;
}


export interface ScpiDetail {
  id: number;
  name: string;
  manager: string;
  capitalization: number;
  sharePrice: number;
  minimumSubscription: number;
  distributionRate: number;
  subscriptionFees: number;
  managementFees: number;
  enjoymentDelay: string;
  rentFrequency: string;
  advertising?: string;
  scpiPartValues: { valuationYear: number; sharePrice: number ; reconstitutionValue: number }[];

}

export interface ScpiWithRates {
  id: number;
  name: string;
  capitalization: number; 
  rentFrequency: string;
  enjoymentDelay: number;
  minimumSubscription: number;
  subscriptionFees: number;
  cashback: number;
  distributionRates: DistributionRate[];
}
