import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Meta from 'gi://Meta';
import Mtk from 'gi://Mtk';
import { makeWidget, setStyles } from '../gjs/widget.js';
import { Shape } from './Shape.js';

export class Cursor implements Shape {
  widget = makeWidget();

  private shellTracker = Meta.CursorTracker.get_for_display(global.display);

  private idleSource: undefined | number = undefined;

  constructor() {
    this.shellTracker.connect('visibility-changed', () => this.update());

    this.shellTracker.connect('cursor-changed', () => {
      this.update();

      // sometimes the correct scale is only returned in next idle phase
      this.idleSource = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
        this.update();
        this.idleSource = undefined;
        return GLib.SOURCE_REMOVE;
      });
    });
  }

  destroy() {
    if (this.idleSource !== undefined) {
      GLib.source_remove(this.idleSource);
      this.idleSource = undefined;
    }
  }

  private update() {
    const texture = this.shellTracker.get_sprite();
    if (!this.shellTracker.get_pointer_visible() || !texture) {
      this.widget.hide();
      return;
    }
    this.widget.show();

    const [width, height] = [texture.get_width(), texture.get_height()];
    const clip = new Mtk.Rectangle({ x: 0, y: 0, width, height });
    const content = Clutter.TextureContent.new_from_texture(texture, clip);
    this.widget.set_content(content);

    setStyles(this.widget, {
      width: `${width}px`,
      height: `${height}px`,
    });

    // const scale = this.shellTracker.get_scale();
    const scale =
      1 /
      global.display.get_monitor_scale(global.display.get_current_monitor());
    this.widget.set_scale(scale, scale);

    const [hotX, hotY] = this.shellTracker.get_hot().map((v) => v * scale);
    this.widget.set_translation(-hotX, -hotY, 0);
  }
}
