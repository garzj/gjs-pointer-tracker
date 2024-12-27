import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// @ts-ignore
import { getPointerWatcher } from 'resource:///org/gnome/shell/ui/pointerWatcher.js';
import { makeWidget } from '../gjs/widget.js';
import { TrackerShape } from '../prefs/schema/TrackerShape.js';
import { SettingsSubscriber } from '../prefs/subscriber.js';
import { exhausted } from '../ts/exhausted.js';
import { Circle } from './Circle.js';
import { Cursor } from './Cursor.js';

export class Tracker {
  private isActive = false;

  private MIN_WATCHER_INTERVAL = 10;
  private pointerListener: Record<any, any> | null = null;

  private widget = makeWidget();
  private circle: Circle;
  private cursor: Cursor;

  constructor(private settingsSub: SettingsSubscriber) {
    this.circle = new Circle(settingsSub);
    this.cursor = new Cursor();

    settingsSub.connect('changed::tracker-shape', () => this.updateShape());
    this.updateShape();
  }

  destroy() {
    this.setActive(false);
    this.widget.destroy();
  }

  setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;

    if (active) {
      Main.layoutManager.addTopChrome(this.widget);

      this.pointerListener = getPointerWatcher().addWatch(
        this.MIN_WATCHER_INTERVAL,
        (x: number, y: number) => this.widget.set_position(x, y),
      );
      const [initialX, initialY] = global.get_pointer();
      this.widget.set_position(initialX, initialY);
    } else {
      Main.layoutManager.removeChrome(this.widget);

      this.pointerListener?.remove();
      this.pointerListener = null;
    }
  }

  updateShape() {
    const shape: TrackerShape =
      this.settingsSub.settings.get_enum('tracker-shape');
    this.widget.remove_all_children();
    switch (shape) {
      case TrackerShape.CIRCLE:
        this.widget.add_child(this.circle.widget);
        break;
      case TrackerShape.CURSOR:
        this.widget.add_child(this.cursor.widget);
        break;
      default:
        exhausted(shape);
    }
  }
}
