import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
// @ts-ignore
import { KeybindsManager } from './KeybindsManager.js';
import { TrackerManager } from './TrackerManager.js';

export default class PointerTrackerExtension extends Extension {
  tracker: TrackerManager | null = null;
  keybinds: KeybindsManager | null = null;

  enable() {
    const settings = this.getSettings();

    this.tracker = new TrackerManager(settings);

    this.keybinds = new KeybindsManager(settings);
  }

  disable() {
    this.tracker?.destroy();
    this.tracker = null;

    this.keybinds?.destroy();
    this.keybinds = null;
  }
}
