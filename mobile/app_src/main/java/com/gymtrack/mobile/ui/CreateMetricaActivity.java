package com.gymtrack.mobile.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.gymtrack.mobile.R;
import com.gymtrack.mobile.api.ApiClient;
import com.gymtrack.mobile.api.GymTrackApi;
import com.gymtrack.mobile.models.Metrica;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CreateMetricaActivity extends AppCompatActivity {

    private EditText etPeso, etAltura;
    private Button btnSave;
    private GymTrackApi apiService;

    // Token temporal (igual que en MainActivity)
    private static final String TEMP_TOKEN = "Bearer PON_TU_TOKEN_AQUI";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_metrica);

        etPeso = findViewById(R.id.etPeso);
        etAltura = findViewById(R.id.etAltura);
        btnSave = findViewById(R.id.btnSave);

        apiService = ApiClient.getClient().create(GymTrackApi.class);

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                crearMetrica();
            }
        });
    }

    private void crearMetrica() {
        String pStr = etPeso.getText().toString();
        String aStr = etAltura.getText().toString();

        if (pStr.isEmpty() || aStr.isEmpty()) {
            Toast.makeText(this, "Llene los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        Metrica nuevaMetrica = new Metrica(Double.parseDouble(pStr), Double.parseDouble(aStr));

        Call<Metrica> call = apiService.createMetrica(TEMP_TOKEN, nuevaMetrica);
        call.enqueue(new Callback<Metrica>() {
            @Override
            public void onResponse(Call<Metrica> call, Response<Metrica> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(CreateMetricaActivity.this, "Métrica creada éxito!", Toast.LENGTH_SHORT).show();
                    finish(); // Cerrar vista y volver as MainActivity
                } else {
                    Toast.makeText(CreateMetricaActivity.this, "Error: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Metrica> call, Throwable t) {
                Toast.makeText(CreateMetricaActivity.this, "Falla: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
