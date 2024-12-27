import { ScreenRecordingNotifier } from './gjs/notifiers/ScreenRecordingNotifier.js';
import { ScreenSharingNotifier } from './gjs/notifiers/ScreenSharingNotifier.js';
import { SettingsSubscriber } from './prefs/subscriber.js';
import { Tracker } from './tracker/Tracker.js';

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export class TrackerManager {
  isActive = false;
  tracker: Tracker;

  activePref = false;

  screenSharingActivePref = false;
  private screenSharingNotifier = new ScreenSharingNotifier();
  private isSharing = false;
  private screenSharingSub: number | null = null;

  screenRecordingActivePref = false;
  private screenRecordingNotifier = new ScreenRecordingNotifier();
  private isRecording = false;
  private screenRecordingSub: number | null = null;

  constructor(public settingsSub: SettingsSubscriber) {
    this.tracker = new Tracker(this.settingsSub);

    this.watchActivePref('activePref', 'tracker-active');

    this.watchActivePref(
      'screenSharingActivePref',
      'tracker-always-on-screen-sharing',
    );
    this.screenSharingSub = this.screenSharingNotifier.subscribe(
      (isSharing) => {
        this.isSharing = isSharing;
        this.updateActiveState();
      },
    );
    if (this.screenSharingSub === null) {
      console.warn('Failed to subscribe to screensharing events.');
    }

    this.watchActivePref(
      'screenRecordingActivePref',
      'tracker-always-on-screen-recording',
    );
    this.screenRecordingSub = this.screenRecordingNotifier.subscribe(
      (isSharing) => {
        this.isSharing = isSharing;
        this.updateActiveState();
      },
    );
    if (this.screenRecordingSub === null) {
      console.warn('Failed to subscribe to screensharing events.');
    }

    this.updateActiveState();
  }

  watchActivePref(key: BooleanKeys<TrackerManager>, prefName: string) {
    this[key] = this.settingsSub.settings.get_boolean(prefName);
    const onActivePrefUpdate = () => {
      this[key] = this.settingsSub.settings.get_boolean(prefName);
      this.updateActiveState();
    };
    this.settingsSub.connect(`changed::${prefName}`, onActivePrefUpdate);
  }

  updateActiveState() {
    this.tracker.setActive(
      this.activePref ||
        (this.isSharing && this.screenSharingActivePref) ||
        (this.isRecording && this.screenRecordingActivePref),
    );
  }

  destroy() {
    if (this.screenSharingSub !== null) {
      this.screenSharingNotifier.unsubscribe(this.screenSharingSub);
      this.screenSharingSub = null;
    }

    if (this.screenRecordingSub !== null) {
      this.screenRecordingNotifier.unsubscribe(this.screenRecordingSub);
      this.screenRecordingSub = null;
    }

    this.tracker.destroy();
  }
}
