import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../../utils/localStorage.js";

const initialState = loadFromLocalStorage(STORAGE_KEYS.BLOCKS, { items: [] });

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
    reducers: {
    addBlock: (state, action) => {
        state.items.push({ id: uuidv4(), ...action.payload });
        saveToLocalStorage(STORAGE_KEYS.BLOCKS, state);
    },
    removeBlock: (state, action) => {
        state.items = state.items.filter((block) => block.id !== action.payload);
        saveToLocalStorage(STORAGE_KEYS.BLOCKS, state);
    },
    updateBlock: (state, action) => {
        const block = state.items.find((b) => b.id === action.payload.id);
        if (block) {
            block.name = action.payload.name;
            block.content = action.payload.content;
            block.shortcut = action.payload.shortcut;
            saveToLocalStorage(STORAGE_KEYS.BLOCKS, state);
        }
    },
  },
});

export const { addBlock, removeBlock, updateBlock } = blocksSlice.actions;
export default blocksSlice.reducer;