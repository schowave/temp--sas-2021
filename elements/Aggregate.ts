import { Event } from './Event';

class Aggregate {
  public context: string;

  public aggregate: string;

  public aggregateId: string;

  public unpublishedEvents: Event[];

  public constructor ({ context, aggregate, aggregateId }: {
    context: string;
    aggregate: string;
    aggregateId: string;
  }) {
    this.context = context;
    this.aggregate = aggregate;
    this.aggregateId = aggregateId;

    this.unpublishedEvents = [];
  }

  public publishEvent (eventName: string, eventPayload: Record<string, unknown>): void {
    const event = new Event({
      context: this.context,
      aggregate: this.aggregate,
      aggregateId: this.aggregateId,
      name: eventName,
      payload: eventPayload
    });

    this.unpublishedEvents.push(event);
  }
}

export { Aggregate };
