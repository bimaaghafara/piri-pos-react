import * as _ from 'lodash';

import { MBVariable } from './HttpVariableModel';

export class HttpVariableSyncService {
  serializeVariables(variables: MBVariable[] = []) {
    return variables.map(variable => {
      try {
        variable.value = JSON.stringify(variable.value);
      } catch (e) {

      }
      return variable;
    });
  }

  unserializeVariables(variables: MBVariable[] = []) {
    return variables.map(variable => {
      try {
        variable.value = JSON.parse(variable.value);
      } catch (e) {

      }
      return variable;
    });
  }

  getChangedVariables(lastVariables: MBVariable[], variables: MBVariable[]): MBVariable[] {
    const changedVariables = [];
    _.forEach(variables, (variable) => {
      const lastVariable = _.find(lastVariables, { id: variable.id });
      if (lastVariable && JSON.stringify(variable.value) !== JSON.stringify(lastVariable.value)) {
        changedVariables.push(variable);
      } else if (!lastVariable) {
        const newVariable: any = Object.assign({}, variable);
        changedVariables.push(newVariable);
      }
    });
    return changedVariables;
  }
}