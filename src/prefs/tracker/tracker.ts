import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import {
  ExtensionPreferences,
  gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { KeybindingRow } from '../keybinding.js';
import { AboutRow } from './about.js';
import { makeActiveRow } from './active.js';
import { makeCircleRows } from './circle.js';
import { makeShapeRow } from './shape.js';

export const TrackerPage = GObject.registerClass(
  class TrackerPage extends Adw.PreferencesPage {
    constructor(prefs: ExtensionPreferences) {
      super({
        title: _('Pointer Tracker'),
        icon_name: 'input-mouse-symbolic',
      });

      const settings = prefs.getSettings();

      const appearanceGroup = new Adw.PreferencesGroup({
        title: _('Appearance'),
      });
      this.add(appearanceGroup);

      const circleRows = makeCircleRows(settings);
      const shapeRow = makeShapeRow(settings, circleRows);
      appearanceGroup.add(shapeRow);
      for (const circleRow of circleRows) {
        appearanceGroup.add(circleRow);
      }

      const activeGroup = new Adw.PreferencesGroup({
        title: _('Active state'),
      });
      this.add(activeGroup);

      const activeRow = makeActiveRow(settings);
      activeGroup.add(activeRow);

      const keybindingGroup = new Adw.PreferencesGroup({
        title: _('Keybindings'),
      });
      this.add(keybindingGroup);

      const keybindRow = new KeybindingRow(
        settings,
        'tracker-keybinding',
        _('Toggle Tracker'),
      );
      keybindingGroup.set_header_suffix(keybindRow.resetButton);
      keybindingGroup.add(keybindRow);

      const adwVersion = parseFloat(Adw.VERSION_S.substring(0, 3));
      if (adwVersion >= 1.5) {
        const aboutGroup = new Adw.PreferencesGroup({ title: _('About') });
        this.add(aboutGroup);

        const aboutRow = new AboutRow(prefs.metadata);
        aboutGroup.add(aboutRow);
      }
    }
  },
);
