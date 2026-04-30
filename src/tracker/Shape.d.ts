import Clutter from 'gi://Clutter';

export interface Shape {
  widget: Clutter.Actor;

  destroy(): void;
}
