import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import Mtk from 'gi://Mtk';
import { makeWidget, setStyles } from '../gjs/widget.js';

export function makeCursor() {
  const cursor = makeWidget();

  const shellTracker = Meta.CursorTracker.get_for_display(global.display);
  shellTracker.connect('cursor-changed', () => {
    const texture = shellTracker.get_sprite();
    if (!shellTracker.get_pointer_visible() || !texture) {
      cursor.hide();
      return;
    }
    cursor.show();

    const [width, height] = [texture.get_width(), texture.get_height()];
    const clip = new Mtk.Rectangle({ x: 0, y: 0, width, height });
    const content = Clutter.TextureContent.new_from_texture(texture, clip);
    cursor.set_content(content);

    setStyles(cursor, {
      width: `${width}px`,
      height: `${height}px`,
    });

    const scale = shellTracker.get_scale();
    cursor.set_scale(scale, scale);

    const [hotX, hotY] = shellTracker.get_hot();
    cursor.set_translation(-hotX, -hotY, 0);
  });

  return cursor;
}
