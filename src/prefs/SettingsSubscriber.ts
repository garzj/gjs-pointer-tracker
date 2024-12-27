import Gio from 'gi://Gio';

export class SettingsSubscriber {
  connections: number[] = [];

  constructor(public settings: Gio.Settings) {}

  connect: Gio.Settings['connect'] = (id, callback, ...args) => {
    const connectionId = this.settings.connect(id, callback, ...args);
    this.connections.push(connectionId);
    return connectionId;
  };

  disconnect() {
    for (const connection of this.connections) {
      this.settings.disconnect(connection);
    }
  }
}
