import { configureStore } from '@reduxjs/toolkit';

// For now, empty store, will add slices later
export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;