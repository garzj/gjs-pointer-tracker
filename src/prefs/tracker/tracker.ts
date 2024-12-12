import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import {
  ExtensionPreferences,
  gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
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
    }
  },
);
