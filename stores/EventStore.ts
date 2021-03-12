import { Event } from '../elements/Event';

class EventStore {
  private readonly events: Event[];

  public constructor () {
    this.events = [];
  }

  public storeEvent ({ event }: {
    event: Event;
  }): void {
    this.events.push(event);
  }

  public getEvents ({ context, aggregate, aggregateId }: {
    context: string;
    aggregate: string;
    aggregateId: string;
  }): Event[] {
    return this.events.filter((event): boolean =>
      event.context === context &&
      event.aggregate === aggregate &&
      event.aggregateId === aggregateId);
  }
}

export { EventStore };
