import { createSlice } from '@reduxjs/toolkit';

const createTestSlice = createSlice({
  name: 'domanda',
  initialState: {
    datiGenerali: null,
  },
  reducers: {
    setDatiGenerali: (state, action) => {
      state.datiGenerali = action.payload;
    },
  },
});

export const { setDatiGenerali } = createTestSlice.actions;
export default createTestSlice.reducer;
