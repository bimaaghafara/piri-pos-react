export class MHttpApiPaginatedResponse<T> {
  data: T[] = [];
  skip: number = 0;
  take: number = 10;
  total: number = 0;
}

export class MHttpApiPaginated {
  public take = 10;
  public skip = 0;
  public includeTotalCount: boolean = true;
}
