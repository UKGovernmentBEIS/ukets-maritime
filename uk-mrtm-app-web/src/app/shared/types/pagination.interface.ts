export interface Paging {
  page: number;
  pageSize: number;
}

export interface Pagination extends Paging {
  total: number;
}
