import Gdk from 'gi://Gdk';

export function rgbToHex(rgba: Gdk.RGBA): string {
  return (
    '#' +
    [rgba.red, rgba.green, rgba.blue]
      .map((c) => Math.floor(c * 255))
      .map((n) => n.toString(16))
      .map((s) => s.padStart(2, '0'))
      .join('')
  );
}
