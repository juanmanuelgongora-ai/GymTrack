package com.gymtrack.mobile.models;

import com.google.gson.annotations.SerializedName;

public class Metrica {
    @SerializedName("id")
    private int id;

    @SerializedName("peso")
    private double peso;

    @SerializedName("altura")
    private double altura;

    // Relación de objeto asociado (cumpliendo con la premisa del taller)
    @SerializedName("usuario")
    private Usuario usuario;

    public Metrica(double peso, double altura) {
        this.peso = peso;
        this.altura = altura;
    }

    // Getters y Setters
    public int getId() { return id; }
    public double getPeso() { return peso; }
    public void setPeso(double peso) { this.peso = peso; }
    public double getAltura() { return altura; }
    public void setAltura(double altura) { this.altura = altura; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
