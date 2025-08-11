// Core data interfaces for the editor domain
export interface Background {
  src: string;
  originalWidth: number;
  originalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export interface Font {
  family: string;
  weight: number;
  size: number;
}

export interface TextLayer {
  id: string;
  content: string;
  x: number;
  y: number;
  width?: number;
  rotation: number;
  align: 'left' | 'center' | 'right';
  opacity: number;
  fill: string;
  font: Font;
}

export interface Doc {
  background: Background | null;
  layers: TextLayer[];
  selectedIds: string[];
}

// Legacy interfaces (keeping for backward compatibility)
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorState {
  selectedTool: string;
  canvas: {
    width: number;
    height: number;
    zoom: number;
  };
  layers: Layer[];
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: CanvasElement[];
}

export interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, unknown>;
}
