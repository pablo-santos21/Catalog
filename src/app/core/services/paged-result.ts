export interface PagedResult<T> {
  itens: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
