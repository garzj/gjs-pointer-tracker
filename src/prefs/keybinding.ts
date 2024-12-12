import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export const KeybindingRow = GObject.registerClass(
  class KeybindingRow extends Adw.ActionRow {
    label: Gtk.ShortcutLabel;
    box: Gtk.Box;

    resetButton: Gtk.Button;

    captureWindow: Adw.Window | null;

    constructor(
      public settings: Gio.Settings,
      public key: string,
      shortcutName: string,
    ) {
      super({
        title: shortcutName,
        subtitle: _('Set a shortcut'),
        activatable: true,
      });

      this.label = new Gtk.ShortcutLabel({
        disabled_text: _('New shortcut…'),
        valign: Gtk.Align.CENTER,
        hexpand: false,
        vexpand: false,
        accelerator: this.settings.get_strv(this.key)[0],
      });
      this.box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
      this.box.append(this.label);
      this.add_suffix(this.box);

      this.resetButton = new Gtk.Button({
        icon_name: 'edit-delete-symbolic',
        css_classes: ['error'],
        hexpand: false,
        vexpand: false,
      });
      this.resetButton.connect('clicked', this.resetKeybind.bind(this));

      // hide reset button if no shortcut is set
      if (!this.label.accelerator) this.resetButton.visible = false;

      // connect row activation to open capture window
      this.captureWindow = null;
      this.connect('activated', this.openCaptureWindow.bind(this));

      // connect change in accelerator to update setting
      this.label.connect('notify::accelerator', (widget) => {
        this.settings.set_strv(this.key, [widget.accelerator]);
      });
    }

    resetKeybind() {
      this.label.accelerator = '';
      this.resetButton.visible = false;
    }

    openCaptureWindow() {
      const controller = new Gtk.EventControllerKey();

      const content = new Adw.StatusPage({
        title: this.title,
        description: _(
          'Press Esc to cancel or Backspace to disable the shortcut',
        ),
        icon_name: 'preferences-desktop-keyboard-shortcuts-symbolic',
      });

      this.captureWindow = new Adw.Window({
        modal: true,
        hide_on_close: true,
        transient_for: this.get_root() as any,
        width_request: 480,
        height_request: 320,
        content,
      });

      this.captureWindow.add_controller(controller);
      controller.connect('key-pressed', this.registerKey.bind(this));
      this.captureWindow.present();
    }

    registerKey(
      _widget: Gtk.Widget,
      keyval: number,
      keycode: number,
      state: Gdk.ModifierType,
    ) {
      if (!this.captureWindow) return;

      // default modifier mask (keys) that are currently pressed
      let mask = state & Gtk.accelerator_get_default_mod_mask();
      // filter CAPS LOCK
      mask &= ~Gdk.ModifierType.LOCK_MASK;

      // close on ESC
      if (!mask && keyval === Gdk.KEY_Escape) {
        this.captureWindow.close();
        return Gdk.EVENT_STOP;
      }

      // reset on backspace
      if (keyval === Gdk.KEY_BackSpace) {
        this.resetKeybind();
        this.captureWindow.destroy();
        return Gdk.EVENT_STOP;
      }

      // ignore invalid keybindings
      if (
        !this.isValidBinding(mask, keycode, keyval) ||
        !this.isValidAccel(mask, keyval)
      ) {
        return Gdk.EVENT_STOP;
      }

      this.label.accelerator = Gtk.accelerator_name_with_keycode(
        null,
        keyval,
        keycode,
        mask,
      );
      this.resetButton.visible = true;
      this.captureWindow.destroy();
      return Gdk.EVENT_STOP;
    }

    // validating functions from https://gitlab.gnome.org/GNOME/gnome-control-center/-/blob/main/panels/keyboard/keyboard-shortcuts.c
    isValidBinding(mask: number, keycode: number, keyval: number) {
      if (mask === 0) return false;

      if (mask === Gdk.ModifierType.SHIFT_MASK && keycode !== 0) {
        if (
          this.isKeyInRange(keyval, Gdk.KEY_A, Gdk.KEY_Z) ||
          this.isKeyInRange(keyval, Gdk.KEY_0, Gdk.KEY_9) ||
          this.isKeyInRange(keyval, Gdk.KEY_a, Gdk.KEY_z) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_kana_fullstop,
            Gdk.KEY_semivoicedsound,
          ) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_Arabic_comma,
            Gdk.KEY_Arabic_sukun,
          ) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_Serbian_dje,
            Gdk.KEY_Cyrillic_HARDSIGN,
          ) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_Greek_ALPHAaccent,
            Gdk.KEY_Greek_omega,
          ) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_hebrew_doublelowline,
            Gdk.KEY_hebrew_taf,
          ) ||
          this.isKeyInRange(keyval, Gdk.KEY_Thai_kokai, Gdk.KEY_Thai_lekkao) ||
          this.isKeyInRange(
            keyval,
            Gdk.KEY_Hangul_Kiyeog,
            Gdk.KEY_Hangul_J_YeorinHieuh,
          ) ||
          (keyval === Gdk.KEY_space && mask === 0) ||
          this.keyvalIsForbidden(keyval)
        ) {
          return false;
        }
      }
      return true;
    }

    keyvalIsForbidden(keyval: number) {
      return [
        // navigation keys
        Gdk.KEY_Home,
        Gdk.KEY_Left,
        Gdk.KEY_Up,
        Gdk.KEY_Right,
        Gdk.KEY_Down,
        Gdk.KEY_Page_Up,
        Gdk.KEY_Page_Down,
        Gdk.KEY_End,
        Gdk.KEY_Tab,

        // return
        Gdk.KEY_KP_Enter,
        Gdk.KEY_Return,

        Gdk.KEY_Mode_switch,
      ].includes(keyval);
    }

    isKeyInRange(keyval: number, start: number, end: number) {
      return keyval >= start && keyval <= end;
    }

    isValidAccel(mask: number, keyval: number) {
      return (
        Gtk.accelerator_valid(keyval, mask) ||
        (keyval === Gdk.KEY_Tab && mask !== 0)
      );
    }
  },
);
