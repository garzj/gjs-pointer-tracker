import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export class KeybindsManager {
  constructor(private settings: Gio.Settings) {
    Main.wm.addKeybinding(
      'tracker-keybinding',
      this.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.ALL,
      () => this.toggleActivePref(),
    );
  }

  toggleActivePref() {
    this.settings.set_boolean(
      'tracker-active',
      !this.settings.get_boolean('tracker-active'),
    );
  }

  destroy() {
    Main.wm.removeKeybinding('tracker-keybinding');
  }
}
