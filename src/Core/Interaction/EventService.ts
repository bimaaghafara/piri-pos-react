import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';

export class MEvent {
  name: string;
  timestamp: Date;
  data: any;

  constructor(eventName: string, data: any) {
    this.timestamp = new Date();
    this.name = eventName;
    this.data = data;
  }
}

export class EventService {
  private eventObservable: Observable<MEvent>;
  private eventSubject = new Subject<MEvent>();

  constructor() {
    this.eventObservable = this.eventSubject.asObservable();
  }

  on(eventName: string | string[]): Observable<MEvent> {
    const targetEventNames: string[] = _.castArray(eventName);
    return this.eventObservable.filter(ev => targetEventNames.includes(ev.name));
  }

  emit(eventName: string, data: any = undefined) {
    const ev: MEvent = new MEvent(eventName, data);
    this.eventSubject.next(ev);
  }
}
