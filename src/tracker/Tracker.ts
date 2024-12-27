import { makeWidget } from '../gjs/widget.js';
import { TrackerShape } from '../prefs/schema/TrackerShape.js';
import { SettingsSubscriber } from '../prefs/subscriber.js';
import { exhausted } from '../ts/exhausted.js';
import { Circle } from './Circle.js';
import { Cursor } from './Cursor.js';

export class Tracker {
  widget = makeWidget();

  circle: Circle;
  cursor: Cursor;

  constructor(private settingsSub: SettingsSubscriber) {
    this.circle = new Circle(settingsSub);
    this.cursor = new Cursor();

    settingsSub.connect('changed::tracker-shape', () => this.updateShape());
    this.updateShape();
  }

  destroy() {
    this.widget.destroy();
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
