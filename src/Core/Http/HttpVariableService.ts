import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { HttpRequestInterceptedService } from './HttpRequestInterceptedService';
import { httpVariableSyncService } from '../Services';

import { MBVariable } from './HttpVariableModel';

export class HttpVariableService {
  appId: string = 'main-web';
  lastVariables: any = [];
  variables: MBVariable[] = [];

  httpRequestInterceptedService: HttpRequestInterceptedService;

  get(id: string, defaultValue?: any) {
    let variable = _.find(this.variables, { id });

    if (!variable) {
      variable = { ...defaultValue, id };
      this.variables.push(variable);
    }

    return variable;
  }

  load(): Observable<MBVariable[]> {
    return this.httpRequestInterceptedService.get<MBVariable[]>(this.appId).do(variables => {
      const unserializedVariables = httpVariableSyncService.unserializeVariables(variables);
      this.lastVariables = <any>_.map(unserializedVariables.slice(), _.clone);
      this.variables = <any>_.map(unserializedVariables.slice(), _.clone);
    });
  }

  update(): Observable<MBVariable[]> {
    let sourceObservable: Observable<any>;

    const changedVariables = httpVariableSyncService.getChangedVariables(this.lastVariables, this.variables);
    if (changedVariables.length) {
      const serializedVariables = httpVariableSyncService.serializeVariables(changedVariables);
      sourceObservable = this.httpRequestInterceptedService.post<MBVariable[]>(this.appId, { variables: serializedVariables });
    } else {
      sourceObservable = Observable.of(false);
    }

    return sourceObservable;
  }
}
