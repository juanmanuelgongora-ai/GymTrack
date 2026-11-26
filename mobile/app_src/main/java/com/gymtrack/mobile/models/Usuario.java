package com.gymtrack.mobile.models;

import com.google.gson.annotations.SerializedName;

public class Usuario {
    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("email")
    private String email;

    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
