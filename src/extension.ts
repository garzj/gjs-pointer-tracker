import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
// @ts-ignore
import { KeybindsManager } from './KeybindsManager.js';
import { SettingsSubscriber } from './prefs/SettingsSubscriber.js';
import { TrackerManager } from './TrackerManager.js';

export default class PointerTrackerExtension extends Extension {
  settingsSub: SettingsSubscriber | null = null;

  tracker: TrackerManager | null = null;
  keybinds: KeybindsManager | null = null;

  enable() {
    const settings = this.getSettings();
    this.settingsSub = new SettingsSubscriber(settings);

    this.tracker = new TrackerManager(this.settingsSub);
    this.keybinds = new KeybindsManager(settings);
  }

  disable() {
    this.tracker?.destroy();
    this.tracker = null;

    this.keybinds?.destroy();
    this.keybinds = null;

    this.settingsSub?.disconnect();
    this.settingsSub = null;
  }
}
