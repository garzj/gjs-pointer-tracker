import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export function makeActiveRows(settings: Gio.Settings): Gtk.Widget[] {
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

  const screenSharingActiveRow = new Adw.SwitchRow({
    title: _('Override screen sharing'),
    subtitle: _(
      'Always show the tracker while screen sharing (only on Wayland)',
    ),
    active: settings.get_boolean('tracker-always-on-screen-sharing'),
  });
  settings.bind(
    'tracker-always-on-screen-sharing',
    screenSharingActiveRow,
    'active',
    Gio.SettingsBindFlags.DEFAULT,
  );

  const screenRecordingActiveRow = new Adw.SwitchRow({
    title: _('Override screen recording'),
    subtitle: _('Always show the tracker while screen recording'),
    active: settings.get_boolean('tracker-always-on-screen-recording'),
  });
  settings.bind(
    'tracker-always-on-screen-recording',
    screenRecordingActiveRow,
    'active',
    Gio.SettingsBindFlags.DEFAULT,
  );

  return [activeRow, screenSharingActiveRow, screenRecordingActiveRow];
}
