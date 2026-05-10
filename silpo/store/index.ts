import {configureStore} from "@reduxjs/toolkit";
import {AuthService} from "@/services/AuthService";
import {AccountService} from "@/services/AccountService";

export const store = configureStore({
    reducer: {
        [AuthService.reducerPath]: AuthService.reducer,
        [AccountService.reducerPath]: AccountService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(AuthService.middleware)
            .concat(AccountService.middleware)
})