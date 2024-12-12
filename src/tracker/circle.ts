import { makeWidget, setStyles } from '../gjs/widget.js';

export function makeCircle() {
  const circle = makeWidget();

  const size = 24;

  setStyles(circle, {
    'background-color': 'red',
    width: `${size}px`,
    height: `${size}px`,
    'border-radius': `${size / 2}px`,
  });

  circle.set_translation(-size / 2, -size / 2, 0);

  return circle;
}
