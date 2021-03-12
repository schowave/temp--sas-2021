import { Event } from '../elements/Event';
import { EventEmitter } from 'events';

class EventPublisher extends EventEmitter {
  public publish ({ event }: {
    event: Event;
  }): void {
    this.emit('domain-event', { event });
  }
}

export { EventPublisher };
