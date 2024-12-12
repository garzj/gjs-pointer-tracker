import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export function makeActiveRow(settings: Gio.Settings) {
  const activeRow = new Adw.SwitchRow({
    title: _('Active'),
    subtitle: _('Active state of the tracker'),
    active: settings.get_boolean('tracker-active'),
  });

  settings.bind(
    'tracker-active',
    activeRow,
    'active',
    Gio.SettingsBindFlags.DEFAULT,
  );

  return activeRow;
}
