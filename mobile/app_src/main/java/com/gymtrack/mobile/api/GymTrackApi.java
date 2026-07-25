package com.gymtrack.mobile.api;

import com.gymtrack.mobile.models.LoginRequest;
import com.gymtrack.mobile.models.LoginResponse;
import com.gymtrack.mobile.models.Metrica;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface GymTrackApi {

    // Login for authentication
    @POST("login")
    Call<LoginResponse> login(@Body LoginRequest request);

    // Consulta de Métricas (Devuelve Array de Métricas que incluyen al Usuario asociado)
    @GET("metricas")
    Call<List<Metrica>> getMetricas(@Header("Authorization") String token);

    // Creación de nueva Métrica
    @POST("metricas")
    Call<Metrica> createMetrica(@Header("Authorization") String token, @Body Metrica metrica);
}
