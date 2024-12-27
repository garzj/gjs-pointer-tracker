import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// This class will not detect the initial state
export class ScreenRecordingNotifier {
  subscribe(handler: (isRecording: boolean) => void): number {
    return Main.screenshotUI.connect('notify::screencast-in-progress', () => {
      const status = Main.screenshotUI.screencast_in_progress ? true : false;

      handler(status);
    });
  }

  unsubscribe(subscriptionId: number) {
    Main.screenshotUI.disconnect(subscriptionId);
  }
}
