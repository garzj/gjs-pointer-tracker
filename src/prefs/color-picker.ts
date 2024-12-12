import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { rgbToHex } from '../gjs/color.js';

export function makeColorPicker(settings: Gio.Settings, key: string) {
  const colorPicker = new Gtk.ColorDialogButton({
    dialog: new Gtk.ColorDialog({
      modal: true,
      with_alpha: false,
    }),
    margin_end: 8,
    valign: Gtk.Align.CENTER,
    hexpand: false,
    vexpand: false,
  });

  const color = colorPicker.get_rgba();
  color.parse(settings.get_string(key));
  colorPicker.set_rgba(color);

  colorPicker.connect('notify::rgba', () => {
    const hexColor = rgbToHex(colorPicker.get_rgba());
    settings.set_string(key, hexColor);
  });

  return colorPicker;
}
