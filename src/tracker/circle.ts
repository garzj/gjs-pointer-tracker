import { makeWidget, setStyles, Styles } from '../gjs/widget.js';
import { SettingsSubscriber } from '../prefs/subscriber.js';
import { Shape } from './Shape.js';

export class Circle implements Shape {
  widget = makeWidget();

  private styles: Styles = {};

  constructor(private settingsSub: SettingsSubscriber) {
    settingsSub.connect('changed::tracker-size', () => this.updateSize());
    this.updateSize();

    settingsSub.connect('changed::tracker-color', () => this.updateColor());
    this.updateColor();

    settingsSub.connect('changed::tracker-opacity', () => this.updateOpacity());
    this.updateOpacity();
  }

  updateSize() {
    const size = this.settingsSub.settings.get_int('tracker-size');

    this.styles['width'] = `${size}px`;
    this.styles['height'] = `${size}px`;
    this.styles['border-radius'] = `${size / 2}px`;
    setStyles(this.widget, this.styles);

    this.widget.set_translation(-size / 2, -size / 2, 0);
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
