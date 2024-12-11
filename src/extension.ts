'use strict';

import Gio from 'gi://Gio';
import St from 'gi://St';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// @ts-ignore
import { getPointerWatcher } from 'resource:///org/gnome/shell/ui/pointerWatcher.js';
import { makeWidget, setStyles, Styles } from './gjs/widget.js';

export default class PointerTrackerExtension extends Extension {
  settings: Gio.Settings;

  indicator: St.Widget;
  circle: St.Widget;
  circleStyles: Styles;

  MIN_WATCHER_INTERVAL = 10;
  pointerListener: any;

  enable() {
    this.settings = this.getSettings();

    this.circle = makeWidget();
    this.circle.opacity = 128;
    const size = 24;
    this.circleStyles = {
      'background-color': 'red',
      width: `${size}px`,
      height: `${size}px`,
      'border-radius': `${size / 2}px`,
    };
    setStyles(this.circle, this.circleStyles);
    this.circle.set_translation(-size / 2, -size / 2, 0);

    this.indicator = makeWidget();
    this.indicator.add_child(this.circle);

    Main.layoutManager.addTopChrome(this.indicator);

    this.pointerListener = getPointerWatcher().addWatch(
      this.MIN_WATCHER_INTERVAL,
      (x: number, y: number) => this.updateTracker(x, y),
    );
  }

  disable() {
    Main.layoutManager.removeChrome(this.indicator);
    this.indicator.destroy();

    getPointerWatcher().removeWatch(this.pointerListener);
  }

  updateTracker(x: number, y: number) {
    this.indicator.set_position(x, y);
  }
}
