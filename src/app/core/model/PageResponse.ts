export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}
