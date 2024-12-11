'use strict';

import Clutter from 'gi://Clutter';
import St from 'gi://St';

export type Styles = Record<string, any>;

export function setStyles(widget: St.Widget, styles: Styles) {
  widget.set_style(
    Object.entries(styles)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' '),
  );
}

export function makeWidget() {
  return new St.Widget({
    layout_manager: new Clutter.BinLayout(),
    reactive: false,
    x: 0,
    y: 0,
  });
}
