import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "@/constants/Urls";
import {IUserView} from "@/types/auth/IUserView";
import {ILoginResponse} from "@/types/auth/ILoginResponse";
import {ILogin} from "@/types/auth/ILogin";

export const AuthService = createApi({
   reducerPath: "authService",
   tagTypes: ["GetUsers"],
   baseQuery: fetchBaseQuery({baseUrl: BASE_URL+"/api/Auth"}),
    endpoints: (builder) => ({
        getUsers: builder.query<IUserView[], void>({
            query:() => 'GetUsers',
            providesTags: ["GetUsers"]
        }),
        login: builder.mutation<ILoginResponse, ILogin>({
            query:(data) => ({
                url: 'login',
                method: 'POST',
                body: data
            }),

        })
    })
});

export const {
    useGetUsersQuery,
    useLoginMutation,
} = AuthService;