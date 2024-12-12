import Gio from 'gi://Gio';
import St from 'gi://St';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// @ts-ignore
import { getPointerWatcher } from 'resource:///org/gnome/shell/ui/pointerWatcher.js';
import { SettingsSubscriber } from './prefs/subscriber.js';
import { makeTracker } from './tracker/tracker.js';

export default class PointerTrackerExtension extends Extension {
  settings: Gio.Settings;
  settingsSub: SettingsSubscriber;

  tracker: St.Widget;

  MIN_WATCHER_INTERVAL = 10;
  pointerListener: any;

  enable() {
    this.settings = this.getSettings();
    this.settingsSub = new SettingsSubscriber(this.settings);

    this.tracker = makeTracker(this.settingsSub);
    Main.layoutManager.addTopChrome(this.tracker);

    this.pointerListener = getPointerWatcher().addWatch(
      this.MIN_WATCHER_INTERVAL,
      (x: number, y: number) => this.updateTracker(x, y),
    );
    const [initialX, initialY] = global.get_pointer();
    this.updateTracker(initialX, initialY);
  }

  disable() {
    Main.layoutManager.removeChrome(this.tracker);
    this.tracker.destroy();

    this.pointerListener.remove();

    this.settingsSub.disconnect();
  }

  updateTracker(x: number, y: number) {
    this.tracker.set_position(x, y);
  }
}
