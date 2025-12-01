export interface InvestmentRequestDTO {
  scpiId: number;
  investmentType: 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT';
  numberOfShares: number;
  investmentAmount: number;
  dismembermentYears: number | null;
}

export interface ScpiRevenueDetail {
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
  details: ScpiRevenueDetail[];
  history: MonthlyRevenueHistory[];
}

