import usersSlice from "./usersSlice";
import loaderSlice from "./loaderSlice";
import { configureStore } from "@reduxjs/toolkit";
import createTestSlice from "./createTestSlice";

const store = configureStore({
    reducer: {
        users: usersSlice,
        loaders: loaderSlice,
        createTest: createTestSlice,
    }
})

export default store