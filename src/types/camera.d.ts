type CameraMode = 'smooth' | 'instant' | 'deadzone';
type PlayerMode = 'centered' | 'semi-centered';

interface DeadZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CameraOptions {
  worldWidth?: number | null;
  worldHeight?: number | null;
  mode?: CameraMode;
  playerMode?: PlayerMode;
  lerpFactor?: number;
  deadZone?: DeadZone;
  zoom?: number;
}
