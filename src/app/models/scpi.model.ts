export interface Scpi {
  id: number;
  name: string;
  imageUrl: string | null;
  minimumSubscription: number;
  managementFees: number;
  cashback: number;
  advertising: string;
  manager: string;
}

export interface ScpiPage {
  data: Scpi[];
  total: number;
  page: number;
  pageSize: number;
}