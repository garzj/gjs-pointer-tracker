import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
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

  isActive: boolean;
  tracker: St.Widget;

  MIN_WATCHER_INTERVAL = 10;
  pointerListener: any;

  enable() {
    this.isActive = false;

    this.settings = this.getSettings();
    this.settingsSub = new SettingsSubscriber(this.settings);

    this.tracker = makeTracker(this.settingsSub);

    const onActiveUpdate = () => {
      const active = this.settings.get_boolean('tracker-active');
      this.setActive(active);
    };
    this.settingsSub.connect('changed::tracker-active', onActiveUpdate);
    onActiveUpdate();

    Main.wm.addKeybinding(
      'tracker-keybinding',
      this.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.ALL,
      () => this.toggleActivePref(),
    );
  }

  disable() {
    this.setActive(false);

    this.tracker.destroy();

    this.settingsSub.disconnect();

    Main.wm.removeKeybinding('tracker-keybinding');
  }

  setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;

    if (active) {
      Main.layoutManager.addTopChrome(this.tracker);

      this.pointerListener = getPointerWatcher().addWatch(
        this.MIN_WATCHER_INTERVAL,
        (x: number, y: number) => this.updateTracker(x, y),
      );
      const [initialX, initialY] = global.get_pointer();
      this.updateTracker(initialX, initialY);
    } else {
      Main.layoutManager.removeChrome(this.tracker);

      this.pointerListener.remove();
    }
  }

  toggleActivePref() {
    this.settings.set_boolean(
      'tracker-active',
      !this.settings.get_boolean('tracker-active'),
    );
  }

  updateTracker(x: number, y: number) {
    this.tracker.set_position(x, y);
  }
}
