import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000" }); 


export const apiSlice = createApi({
  baseQuery,
  tagTypes:["User"],
  
  endpoints: (builder) => ({}),
});