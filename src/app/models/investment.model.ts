export interface InvestmentRequestDTO {
  scpiId: number;
  investmentType: 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT';
  numberOfShares: number;
  investmentAmount: number;
  dismembermentYears: number | null;
}

