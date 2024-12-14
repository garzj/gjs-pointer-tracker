import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
// @ts-ignore
import { SettingsSubscriber } from './prefs/subscriber.js';
import { TrackerManager } from './TrackerManager.js';

export default class PointerTrackerExtension extends Extension {
  settingsSub: SettingsSubscriber | null = null;

  manager: TrackerManager | null = null;

  enable() {
    const settings = this.getSettings();
    this.settingsSub = new SettingsSubscriber(settings);

    this.manager = new TrackerManager(this.settingsSub);
  }

  disable() {
    this.manager?.destroy();
    this.manager = null;

    this.settingsSub?.disconnect();
    this.settingsSub = null;
  }
}
