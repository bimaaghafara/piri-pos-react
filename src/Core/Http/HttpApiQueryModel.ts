import { MHttpApiFilterItem } from './HttpApiFilterModel';
import { MHttpApiPaginated } from './HttpApiPaginatedModel';

export class MHttpApiQuerySort {
  field: string;
  dir: string;
}

export class MHttpApiQueryFilter {
  filterValues: MHttpApiFilterItem[];
}

export class MHttpApiQueryOption extends MHttpApiPaginated {
  public sort?: MHttpApiQuerySort[] = new Array<MHttpApiQuerySort>();
  public filter: MHttpApiQueryFilter[] = new Array<MHttpApiQueryFilter>();
}
