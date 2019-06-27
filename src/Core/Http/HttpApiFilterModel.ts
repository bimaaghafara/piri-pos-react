export class MHttpApiFilterItem {
  field: string;
  operator: string;
  value: string;
  ignoreCase?: boolean;
}

export class MHttpApiFilterMap {
  [key: string]: boolean | {
    operator?: string;
    group?: 'or' | 'and';
    ignoreCase?: boolean;

    targetVar?: 'boolean' | 'number' | 'date';
    dateFormat?: string;

    targetFilter?: 'body' | 'param';
  };
}

export class MHttpApiFilterParsed {
  qParams: {
    [key: string]: any,
  } = {};
  qBody: {
    [key: string]: MHttpApiFilterItem[],
  } = {};
}
