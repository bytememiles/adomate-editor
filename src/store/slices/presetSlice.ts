import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FontProperties } from './selectedLayerSlice';

export interface TextPreset {
  font: FontProperties;
  fill: string;
  underline: boolean;
  strikethrough: boolean;
}

export interface ImagePreset {
  opacity: number;
  borderWidth: number;
  borderColor: string;
}

export interface PresetState {
  text: TextPreset;
  image: ImagePreset;
}

const defaultFontProperties: FontProperties = {
  family: 'Arial',
  size: 16,
  weight: 400,
  style: 'normal',
  align: 'left',
};

const initialState: PresetState = {
  text: {
    font: defaultFontProperties,
    fill: '#000000',
    underline: false,
    strikethrough: false,
  },
  image: {
    opacity: 1,
    borderWidth: 0,
    borderColor: '#000000',
  },
};

export const presetSlice = createSlice({
  name: 'preset',
  initialState,
  reducers: {
    // Update text preset
    updateTextPreset: (state, action: PayloadAction<Partial<TextPreset>>) => {
      state.text = { ...state.text, ...action.payload };
    },

    // Update text font preset
    updateTextFontPreset: (state, action: PayloadAction<Partial<FontProperties>>) => {
      state.text.font = { ...state.text.font, ...action.payload };
    },

    // Update image preset
    updateImagePreset: (state, action: PayloadAction<Partial<ImagePreset>>) => {
      state.image = { ...state.image, ...action.payload };
    },

    // Reset text preset to defaults
    resetTextPreset: (state) => {
      state.text = initialState.text;
    },

    // Reset image preset to defaults
    resetImagePreset: (state) => {
      state.image = initialState.image;
    },

    // Reset all presets to defaults
    resetAllPresets: (state) => {
      state.text = initialState.text;
      state.image = initialState.image;
    },
  },
});

export const {
  updateTextPreset,
  updateTextFontPreset,
  updateImagePreset,
  resetTextPreset,
  resetImagePreset,
  resetAllPresets,
} = presetSlice.actions;

export default presetSlice.reducer;
