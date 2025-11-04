export interface RepartitionItem {
  label: string;
  percentage: number;
}

export interface ScpiRepartition {
  geographical: RepartitionItem[];
  sectoral: RepartitionItem[];
}