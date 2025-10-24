export interface Scpi {
  id: number;
  name: string;
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