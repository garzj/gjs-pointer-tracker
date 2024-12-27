import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// @ts-ignore
import { getPointerWatcher } from 'resource:///org/gnome/shell/ui/pointerWatcher.js';
import { makeWidget } from '../gjs/widget.js';
import { TrackerShape } from '../prefs/schema/TrackerShape.js';
import { SettingsSubscriber } from '../prefs/SettingsSubscriber.js';
import { exhausted } from '../ts/exhausted.js';
import { Circle } from './Circle.js';
import { Cursor } from './Cursor.js';
import { Shape } from './Shape.js';

export class Tracker {
  private isActive = false;

  private raiseSignalId: number | null = null;

  private MIN_WATCHER_INTERVAL = 10;
  private pointerListener: Record<any, any> | null = null;

  private widget = makeWidget();
  private shape: Shape | null = null;

  private settingsSub: SettingsSubscriber;

  constructor(private settings: Gio.Settings) {
    this.settingsSub = new SettingsSubscriber(settings);

    this.settingsSub.connect('changed::tracker-shape', () =>
      this.updateShape(),
    );
    this.updateShape();
  }

  destroy() {
    this.settingsSub.disconnect();

    if (this.raiseSignalId !== null) {
      Main.layoutManager.uiGroup.disconnect(this.raiseSignalId);
      this.raiseSignalId = null;
    }

    this.shape?.destroy();

    this.setActive(false);
    this.widget.destroy();
  }

  setActive(active: boolean) {
    if (this.isActive === active) return;
    this.isActive = active;

    if (this.raiseSignalId !== null) {
      Main.layoutManager.uiGroup.disconnect(this.raiseSignalId);
      this.raiseSignalId = null;
    }

    if (active) {
      Main.layoutManager.uiGroup.add_child(this.widget);

      this.pointerListener = getPointerWatcher().addWatch(
        this.MIN_WATCHER_INTERVAL,
        (x: number, y: number) => this.updatePosition(x, y),
      );
      const [initialX, initialY] = global.get_pointer();
      this.updatePosition(initialX, initialY);
    } else {
      Main.layoutManager.uiGroup.remove_child(this.widget);

      this.pointerListener?.remove();
      this.pointerListener = null;
    }
  }

  updatePosition(x: number, y: number) {
    this.raiseToTop();
    this.widget.set_position(x, y);
  }

  raiseToTop() {
    const parent = this.widget.get_parent();
    if (!parent) return;
    parent.set_child_above_sibling(this.widget, null);
  }

  updateShape() {
    const shape: TrackerShape =
      this.settingsSub.settings.get_enum('tracker-shape');
    this.widget.remove_all_children();
    this.shape?.destroy();

    switch (shape) {
      case TrackerShape.CIRCLE:
        this.shape = new Circle(this.settings);
        break;
      case TrackerShape.CURSOR:
        this.shape = new Cursor();
        break;
      default:
        exhausted(shape);
    }

    this.widget.add_child(this.shape.widget);
  }
}
