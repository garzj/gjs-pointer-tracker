import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { makeColorPicker } from '../color-picker.js';

export function makeCircleRows(settings: Gio.Settings): Gtk.Widget[] {
  const sizeRow = new Adw.SpinRow({
    title: _('Size'),
    subtitle: _('Size of the tracker'),
    adjustment: new Gtk.Adjustment({
      lower: 8,
      upper: 1024,
      step_increment: 8,
    }),
    value: settings.get_int('tracker-size'),
  });
  sizeRow.adjustment.connect('value-changed', (widget) => {
    settings.set_int('tracker-size', widget.value);
  });

  const colorRow = new Adw.ActionRow({
    title: _('Color'),
    subtitle: _('Default color of the tracker'),
  });
  const colorBox = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
  });
  const colorPicker = makeColorPicker(settings, 'tracker-color');
  colorBox.append(colorPicker);
  colorRow.add_suffix(colorBox);

  return [sizeRow, colorRow];
}
