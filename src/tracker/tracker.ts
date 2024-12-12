import { makeWidget } from '../gjs/widget.js';
import { TrackerShape } from '../prefs/schema/TrackerShape.js';
import { SettingsSubscriber } from '../prefs/subscriber.js';
import { exhausted } from '../ts/exhausted.js';
import { makeCircle } from './circle.js';
import { makeCursor } from './cursor.js';

export function makeTracker(settingsSub: SettingsSubscriber) {
  const tracker = makeWidget();

  const circle = makeCircle(settingsSub);
  const cursor = makeCursor();

  function updateShape() {
    const shape: TrackerShape = settingsSub.settings.get_enum('tracker-shape');
    tracker.remove_all_children();
    switch (shape) {
      case TrackerShape.CIRCLE:
        tracker.add_child(circle);
        break;
      case TrackerShape.CURSOR:
        tracker.add_child(cursor);
        break;
      default:
        exhausted(shape);
    }
  }
  settingsSub.connect('changed::tracker-shape', updateShape);
  updateShape();

  tracker.opacity = 128;

  return tracker;
}
