import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "@/constants/Urls";
import {IUserView} from "@/types/auth/IUserView";

export const AuthService = createApi({
   reducerPath: "authService",
   tagTypes: ["GetUsers"],
   baseQuery: fetchBaseQuery({baseUrl: BASE_URL+"/api/Auth"}),
    endpoints: (builder) => ({
        getUsers: builder.query<IUserView[], void>({
            query:() => 'GetUsers',
            providesTags: ["GetUsers"]
        })
    })
});

export const {
    useGetUsersQuery
} = AuthService;