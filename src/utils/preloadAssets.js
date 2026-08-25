import { useTexture } from "@react-three/drei";

const TEXTURES = [
  "/textures/sun.jpg",
  "/textures/earth_day.jpg",
  "/textures/earth_normal.jpg",
  "/textures/earth_clouds.jpg",
  "/textures/moon.jpg",
  "/textures/moon_bump.jpg",
  "/textures/3.jpg",
];

export function preloadAllTextures() {
  TEXTURES.forEach((path) => useTexture.preload(path));
}