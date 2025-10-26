import Gio from 'gi://Gio';

export class SettingsSubscriber {
  connections: number[] = [];

  constructor(public settings: Gio.Settings) {}

  connect: Gio.Settings['connect'] = (
    signal: string,
    callback: (...args: unknown[]) => void,
  ): number => {
    const connectionId = this.settings.connect(signal, callback);
    this.connections.push(connectionId);
    return connectionId;
  };

  disconnect() {
    for (const connection of this.connections) {
      this.settings.disconnect(connection);
    }
  }
}
