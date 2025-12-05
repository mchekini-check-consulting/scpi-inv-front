export interface InvestmentRequestDTO {
  scpiId: number;
  investmentType: 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT';
  numberOfShares: number;
  investmentAmount: number;
  dismembermentYears: number | null;
  paymentType: 'ONE_SHOT' | 'SCHEDULED';
  scheduledPaymentDate: string;
  monthlyAmount: number;
}

export interface ScpiRevenueDetail {
  scpiId: number;
  scpiName: string;
  monthlyRevenue: number;
  investmentAmount: number;
  distributionRate: number;
  investmentType: 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT';
}

export interface MonthlyRevenueHistory {
  year: number;
  month: number;
  revenue: number;
}

export interface MonthlyRevenue {
  totalMonthlyRevenue: number;
  totalFutureMonthlyRevenue: number;
  totalCumulRevenue: number;
  details: ScpiRevenueDetail[];
  history: MonthlyRevenueHistory[];
}

