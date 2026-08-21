import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  selectedNotes: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: "name" | "price" | "rating";
  searchQuery: string;
}

const initialState: FilterState = {
  selectedNotes: [],
  selectedBrands: [],
  priceRange: [0, 500],
  sortBy: "name",
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleNote: (state, action: PayloadAction<string>) => {
      const note = action.payload;
      const index = state.selectedNotes.indexOf(note);

      if (index > -1) {
        state.selectedNotes.splice(index, 1);
      } else {
        state.selectedNotes.push(note);
      }
    },

    toggleBrand: (state, action: PayloadAction<string>) => {
      const brand = action.payload;
      const index = state.selectedBrands.indexOf(brand);

      if (index > -1) {
        state.selectedBrands.splice(index, 1);
      } else {
        state.selectedBrands.push(brand);
      }
    },

    setPriceRange: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      state.priceRange = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<"name" | "price" | "rating">
    ) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    resetFilters: () => initialState,
  },
});

export const {
  toggleNote,
  toggleBrand,
  setPriceRange,
  setSortBy,
  setSearchQuery,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
