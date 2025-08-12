import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  x: number;
  y: number;
}

export interface Transform {
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export interface FontProperties {
  family: string;
  size: number;
  weight: number;
  style: 'normal' | 'italic';
  align: 'left' | 'center' | 'right';
}

export interface TextLayerProperties {
  font: FontProperties;
  fill: string;
  underline?: boolean;
  strikethrough?: boolean;
}

export interface ImageLayerProperties {
  src: string;
  width: number;
  height: number;
  opacity: number;
}

export interface SelectedLayerState {
  id: string | null;
  type: 'text' | 'image' | null;
  properties: TextLayerProperties | ImageLayerProperties | null;
  position: Position | null;
  transform: Transform | null;
  isEditing: boolean;
}

const initialState: SelectedLayerState = {
  id: null,
  type: null,
  properties: null,
  position: null,
  transform: null,
  isEditing: false,
};

export const selectedLayerSlice = createSlice({
  name: 'selectedLayer',
  initialState,
  reducers: {
    // Set the selected layer
    setSelectedLayer: (state, action: PayloadAction<{ id: string; type: 'text' | 'image' }>) => {
      state.id = action.payload.id;
      state.type = action.payload.type;
      state.isEditing = false;
    },

    // Clear the selected layer
    clearSelectedLayer: (state) => {
      state.id = null;
      state.type = null;
      state.properties = null;
      state.position = null;
      state.transform = null;
      state.isEditing = false;
    },

    // Update selected layer properties
    updateSelectedLayerProperties: (
      state,
      action: PayloadAction<Partial<TextLayerProperties | ImageLayerProperties>>,
    ) => {
      if (state.properties) {
        state.properties = { ...state.properties, ...action.payload };
      }
    },

    // Update selected layer position
    updateSelectedLayerPosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload;
    },

    // Update selected layer transform
    updateSelectedLayerTransform: (state, action: PayloadAction<Partial<Transform>>) => {
      if (state.transform) {
        state.transform = { ...state.transform, ...action.payload };
      } else {
        state.transform = { scaleX: 1, scaleY: 1, rotation: 0, ...action.payload };
      }
    },

    // Set edit mode
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    // Initialize layer properties (called when layer is selected)
    initializeLayerProperties: (
      state,
      action: PayloadAction<{
        properties: TextLayerProperties | ImageLayerProperties;
        position: Position;
        transform?: Transform;
      }>,
    ) => {
      state.properties = action.payload.properties;
      state.position = action.payload.position;
      state.transform = action.payload.transform || { scaleX: 1, scaleY: 1, rotation: 0 };
    },
  },
});

export const {
  setSelectedLayer,
  clearSelectedLayer,
  updateSelectedLayerProperties,
  updateSelectedLayerPosition,
  updateSelectedLayerTransform,
  setEditMode,
  initializeLayerProperties,
} = selectedLayerSlice.actions;

export default selectedLayerSlice.reducer;
