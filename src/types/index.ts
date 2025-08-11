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
