import {configureStore} from "@reduxjs/toolkit";
import {AuthService} from "@/services/AuthService";

export const store = configureStore({
    reducer: {
        [AuthService.reducerPath]: AuthService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(AuthService.middleware)
})