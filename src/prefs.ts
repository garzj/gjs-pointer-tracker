import Adw from 'gi://Adw';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { TrackerPage } from './prefs/tracker/tracker.js';

export default class PointerTrackerPreferences extends ExtensionPreferences {
  async fillPreferencesWindow(window: Adw.PreferencesWindow) {
    window.default_width = 460;
    window.default_height = 800;

    window.add(new TrackerPage(this));
  }
}
