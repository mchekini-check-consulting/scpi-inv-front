export interface ProfileRequest {
  status: string;
  children: number;
  incomeInvestor: number;
  incomeConjoint?: number;
}

export interface ProfileResponse {
  id: number;
  status: string;
  children: number;
  incomeInvestor: number;
  incomeConjoint?: number;
}
