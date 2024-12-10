import usersSlice from "./usersSlice";
import loaderSlice from "./loaderSlice";
import { configureStore } from "@reduxjs/toolkit";
import createTestSlice from "./createTestSlice";
import examsSlice from "./examsSlice";

const store = configureStore({
    reducer: {
        users: usersSlice,
        loaders: loaderSlice,
        createTest: createTestSlice,
        examsSlice: examsSlice,
    }
})

export default store