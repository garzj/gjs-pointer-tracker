import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import { makeWidget, setStyles, Styles } from '../gjs/widget.js';
import { SettingsSubscriber } from '../prefs/SettingsSubscriber.js';
import { Shape } from './Shape.js';

export class Circle implements Shape {
  widget = makeWidget();

  private styles: Styles = {};

  private settingsSub: SettingsSubscriber;

  constructor(settings: Gio.Settings) {
    this.settingsSub = new SettingsSubscriber(settings);

    this.settingsSub.connect('changed::tracker-size', () => this.updateSize());
    this.updateSize();

    this.settingsSub.connect('changed::tracker-color', () =>
      this.updateColor(),
    );
    this.updateColor();

    this.settingsSub.connect('changed::tracker-opacity', () =>
      this.updateOpacity(),
    );
    this.updateOpacity();
  }

  destroy() {
    this.settingsSub.disconnect();
  }

  updateSize() {
    const size = this.settingsSub.settings.get_int('tracker-size');

    this.styles['width'] = `${size}px`;
    this.styles['height'] = `${size}px`;
    this.styles['border-radius'] = `${size / 2}px`;
    setStyles(this.widget, this.styles);

    const alignScale = Meta.is_wayland_compositor() ? 2 : 1;
    this.widget.set_translation(-size / alignScale, -size / alignScale, 0);
  }

  updateColor() {
    const hexColor = this.settingsSub.settings.get_string('tracker-color');
    this.styles['background-color'] = hexColor;
    setStyles(this.widget, this.styles);
  }

  updateOpacity() {
    const opacitySetting = this.settingsSub.settings.get_int('tracker-opacity');
    this.widget.opacity = Math.ceil(opacitySetting * 2.55);
  }
}
