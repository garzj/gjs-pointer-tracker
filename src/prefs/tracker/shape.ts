import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export function makeShapeRow(settings: Gio.Settings) {
  const shapeLabelList = new Gtk.StringList();
  shapeLabelList.append(_('Circle'));
  shapeLabelList.append(_('Cursor'));

  const shapeRow = new Adw.ComboRow({
    title: _('Shape'),
    subtitle: _('Shape of the tracker'),
    model: shapeLabelList,
    selected: settings.get_enum('tracker-shape'),
  });
  shapeRow.connect('notify::selected', (widget) => {
    settings.set_enum('tracker-shape', widget.selected);
  });

  return shapeRow;
}
