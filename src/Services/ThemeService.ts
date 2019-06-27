import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { StyleSheet } from 'react-native';

export class ThemeService {
  themeStyles: any = {};
  activatedStyles: any;

  theme$: BehaviorSubject<string> = new BehaviorSubject('default');

  initStyles() {
    const defaultStyles = _.get(this.themeStyles, 'default', {});
    const currentStyles = _.get(this.themeStyles, this.theme$.value, {});
    this.activatedStyles = _.merge({}, defaultStyles, currentStyles);
  }

  set(styleIdentifier: string, styles: any, name?: string) {
    styleIdentifier = styleIdentifier || 'global';
    const styleKey = name || this.theme$.value;
    const targetStyles = { [styleIdentifier]: StyleSheet.create(styles) };
    const existingStyles = _.get(this.themeStyles, styleKey, {});
    const mergedStyles = _.merge({}, existingStyles, targetStyles);
    _.set(this.themeStyles, styleKey, mergedStyles);

    this.initStyles();
  }

  get(stylePath: string) {
    if (!this.activatedStyles) {
      this.initStyles();
    }

    return _.get(this.activatedStyles, stylePath);
  }

  bind(component: any, customPrefix?: string) {
    const prefix = customPrefix || component.constructor.name;
    this.theme$.subscribe(() => {
      component.forceUpdate();
    });

    return {
      set: this.set,
      get: (path: string) => this.get(prefix + (path ? '.' : '') + path),
    };
  }

  setActive(name: string) {
    this.activatedStyles = _.merge({}, this.activatedStyles, _.get(this.themeStyles, name, {}));

    this.theme$.next(name);
  }
}
