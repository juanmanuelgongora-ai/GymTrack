package com.gymtrack.mobile.api;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    // 10.0.2.2 es la IP mágica del emulador de Android para acceder a localhost (127.0.0.1) del sistema host
    private static final String BASE_URL = "http://10.0.2.2:8000/api/";
    private static Retrofit retrofit = null;

    public static Retrofit getClient() {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
