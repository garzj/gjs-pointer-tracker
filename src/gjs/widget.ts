'use strict';

import Clutter from 'gi://Clutter';
import Shell from 'gi://Shell';
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
  const widget = new St.Widget({
    layout_manager: new Clutter.BinLayout(),
    reactive: false,
    track_hover: false,
    can_focus: false,
    x: 0,
    y: 0,
  });
  Shell.util_set_hidden_from_pick(widget, true);
  return widget;
}
