/// <reference types="vite/client" />

declare module '*.svg' {
  const svgUrl: string;
  export default svgUrl;
}

// This ensures all SVG imports are handled
declare module '*vite.svg' {
  const value: string;
  export default value;
} 