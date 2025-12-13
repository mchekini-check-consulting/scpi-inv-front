export interface DistributionRate {
  distributionYear: number;
  rate: number;
  scpiId: number;
}

export interface DistributionRateChartResponse {
  rates: DistributionRate[];
  avg3Years: number;
  insufficientHistory: boolean;
}