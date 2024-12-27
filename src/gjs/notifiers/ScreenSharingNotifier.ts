import Meta from 'gi://Meta';

interface Handle {
  is_recording: boolean;
  connect: (event: 'stopped', handler: () => void) => number;
  disconnect: (_: number) => void;
}

// This class will not detect the initial state
export class ScreenSharingNotifier {
  private handles: Map<number, Handle> = new Map<number, Handle>();
  private controller: any;

  subscribe(handler: (isSharing: boolean) => void): number | null {
    if (!Meta.is_wayland_compositor()) {
      console.warn("Not on wayland. Detecting screen sharing won't work.");
      return null;
    }

    this.controller = global.backend.get_remote_access_controller();
    if (!this.controller) {
      console.warn(
        'Screen sharing detection failed: could not retrieve access controller',
      );
      return null;
    }

    return this.controller.connect('new-handle', (_: any, handle: Handle) => {
      if (handle.is_recording) {
        return;
      }

      const stopId = handle.connect('stopped', () => {
        handle.disconnect(stopId);
        this.handles.delete(stopId);

        if (this.handles.size === 0) {
          handler(false);
        }
      });

      handler(true);

      this.handles.set(stopId, handle);
    });
  }

  unsubscribe(subscriptionId: number) {
    this.controller?.disconnect(subscriptionId);

    for (const handlePair of this.handles) {
      handlePair[1].disconnect(handlePair[0]);
    }
  }
}
