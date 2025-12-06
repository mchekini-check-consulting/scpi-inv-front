export interface ScheduledPaymentRequest {
  scpiId: number;
  firstPaymentAmount: number | null;
  monthlyAmount: number;
  monthlyShares: number;
  firstDebitDate: string;      
}

export interface ScpiSummary {
  id: number;
  name: string;
  imageUrl: string;
  manager: string;
  minimumSubscription: number;
  cashback: number;
  advertising: string;
  distributionRate: number;
  country: string;
  sharePrice: number;
}
