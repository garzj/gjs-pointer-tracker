import Meta from 'gi://Meta';

export function isWayland() {
  return Meta.is_wayland_compositor?.() ?? true;
}
