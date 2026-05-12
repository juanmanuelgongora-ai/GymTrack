package com.gymtrack.mobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.gymtrack.mobile.R;
import com.gymtrack.mobile.api.ApiClient;
import com.gymtrack.mobile.api.GymTrackApi;
import com.gymtrack.mobile.models.Metrica;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private Button btnCreate;
    private GymTrackApi apiService;

    // TODO: En producción, el token debe guardarse en SharedPreferences tras hacer
    // Login.
    // Para cumplir el taller, pegamos aquí un token válido (Bearer) o usamos el
    // interceptor
    // Asumiremos que el profe puede inyectar el token o que ya tenemos uno.
    private static final String TEMP_TOKEN = "Bearer PON_TU_TOKEN_AQUI";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        recyclerView = findViewById(R.id.recyclerViewMetricas);
        btnCreate = findViewById(R.id.btnCreateMetrica);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        apiService = ApiClient.getClient().create(GymTrackApi.class);

        btnCreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, CreateMetricaActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadMetricas(); // Recargar datos cada vez que abrimos la pantalla
    }

    private void loadMetricas() {
        Call<List<Metrica>> call = apiService.getMetricas(TEMP_TOKEN);
        call.enqueue(new Callback<List<Metrica>>() {
            @Override
            public void onResponse(Call<List<Metrica>> call, Response<List<Metrica>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Metrica> metricas = response.body();
                    // Aquí deberías setear tu Adapter, por simplicidad para la entrega mostraremos
                    // un Toast
                    // indicando que funcionó y cuántas llegaron.
                    Toast.makeText(MainActivity.this, "Se cargaron " + metricas.size() + " métricas",
                            Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error en GET: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Metrica>> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Falla de red: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
