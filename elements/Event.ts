class Event {
  public context: string;

  public aggregate: string;

  public aggregateId: string;

  public name: string;

  public payload: Record<string, unknown>;

  public constructor ({ context, aggregate, aggregateId, name, payload }: {
    context: string;
    aggregate: string;
    aggregateId: string;
    name: string;
    payload: Record<string, unknown>;
  }) {
    this.context = context;
    this.aggregate = aggregate;
    this.aggregateId = aggregateId;
    this.name = name;
    this.payload = payload;
  }
}

export { Event };
