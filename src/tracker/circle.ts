import { makeWidget, setStyles, Styles } from '../gjs/widget.js';
import { SettingsSubscriber } from '../prefs/subscriber.js';

export function makeCircle(settingsSub: SettingsSubscriber) {
  const circle = makeWidget();

  const styles: Styles = {};

  function updateSize() {
    const size = settingsSub.settings.get_int('tracker-size');
    console.log('Size:', size);

    styles['width'] = `${size}px`;
    styles['height'] = `${size}px`;
    styles['border-radius'] = `${size / 2}px`;
    setStyles(circle, styles);

    circle.set_translation(-size / 2, -size / 2, 0);
  }
  settingsSub.connect('changed::tracker-size', updateSize);
  updateSize();

  function updateColor() {
    const hexColor = settingsSub.settings.get_string('tracker-color');
    console.log('Color:', hexColor);
    styles['background-color'] = hexColor;
    setStyles(circle, styles);
  }
  settingsSub.connect('changed::tracker-color', updateColor);
  updateColor();

  function updateOpacity() {
    const opacitySetting = settingsSub.settings.get_int('tracker-opacity');
    circle.opacity = Math.ceil(opacitySetting * 2.55);
  }
  settingsSub.connect('changed::tracker-opacity', updateOpacity);
  updateOpacity();

  return circle;
}
