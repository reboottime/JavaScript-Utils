interface IEvent {
  name: string;
  data: any;
  createdAt: number;
}

type Dict<T> = { [key: string]: T } | {};

class DomainEvent implements IEvent {
  name: IEvent["name"];
  data: Dict<any>;
  createdAt: number;

  constructor(name: IEvent["name"], data: IEvent["data"]) {
    this.name = name;
    this.data = data;
    this.createdAt = Date.now();
  }
}

// Naming style is more consistent with backend concepts
// You can extend this Event Bus similar to RabbitMQ with queues, acknowledgements, etc.
class EventBus {
  private listeners: Dict<Function[]> = {};
  subscribe(eventName: IEvent["name"], callback: Function) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  unsubscribe(eventName: IEvent["name"], callback?: Function) {
    if (!this.listeners[eventName]) {
      return;
    }

    if (!callback) {
      this.listeners[eventName] = [];
      delete this.listeners[eventName];

      return;
    }

    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== callback
    );
  }

  publish(event: IEvent) {
    if (!this.listeners[event.name]) {
      console.warn(`No listeners for event: ${event.name}`);

      return;
    }

    this.listeners[event.name].forEach((listener) => {
      listener(event.data);
    });
  }
}
