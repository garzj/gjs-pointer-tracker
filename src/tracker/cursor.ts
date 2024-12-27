import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import Mtk from 'gi://Mtk';
import { makeWidget, setStyles } from '../gjs/widget.js';
import { Shape } from './Shape.js';

export class Cursor implements Shape {
  widget = makeWidget();

  private shellTracker = Meta.CursorTracker.get_for_display(global.display);

  constructor() {
    this.shellTracker.connect('cursor-changed', () => {
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

      const scale = this.shellTracker.get_scale();
      this.widget.set_scale(scale, scale);

      const [hotX, hotY] = this.shellTracker.get_hot().map((v) => v * scale);
      this.widget.set_translation(-hotX, -hotY, 0);
    });
  }
}
