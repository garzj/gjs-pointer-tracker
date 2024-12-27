import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// @ts-ignore
import { getPointerWatcher } from 'resource:///org/gnome/shell/ui/pointerWatcher.js';
import { SettingsSubscriber } from './prefs/subscriber.js';
import { Tracker } from './tracker/Tracker.js';

export class TrackerManager {
  isActive = false;
  tracker: Tracker;

  MIN_WATCHER_INTERVAL = 10;
  pointerListener: Record<any, any> | null = null;

  constructor(public settingsSub: SettingsSubscriber) {
    this.tracker = new Tracker(this.settingsSub);

    const onActiveUpdate = () => {
      const active = this.settingsSub.settings.get_boolean('tracker-active');
      this.setActive(active);
    };
    this.settingsSub.connect('changed::tracker-active', onActiveUpdate);
    onActiveUpdate();

    Main.wm.addKeybinding(
      'tracker-keybinding',
      this.settingsSub.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.ALL,
      () => this.toggleActivePref(),
    );
  }

  destroy() {
    Main.wm.removeKeybinding('tracker-keybinding');

    this.setActive(false);

    this.tracker.destroy();
  }

  setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;

    if (active) {
      Main.layoutManager.addTopChrome(this.tracker.widget);

      this.pointerListener = getPointerWatcher().addWatch(
        this.MIN_WATCHER_INTERVAL,
        (x: number, y: number) => this.updateTracker(x, y),
      );
      const [initialX, initialY] = global.get_pointer();
      this.updateTracker(initialX, initialY);
    } else {
      Main.layoutManager.removeChrome(this.tracker.widget);

      this.pointerListener?.remove();
      this.pointerListener = null;
    }
  }

  toggleActivePref() {
    this.settingsSub.settings.set_boolean(
      'tracker-active',
      !this.settingsSub.settings.get_boolean('tracker-active'),
    );
  }

  updateTracker(x: number, y: number) {
    this.tracker.widget.set_position(x, y);
  }
}
