/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { UserData } from "../types/WeatherDatas";

const API_BASE_URL = "http://localhost:3333/api";

export const AuthService = {
  async update(email: string, nome: string, senha: string): Promise<UserData> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }
    try {
      const response = await axios.put<UserData>(
        `${API_BASE_URL}/users/${userId}`,
        { email, nome, senha }
      );
      localStorage.setItem("currentUserId", response.data._id);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar usuário."
      );
    }
  },

  async login(email: string, senha: string): Promise<UserData> {
    try {
      const response = await axios.post<UserData>(
        `${API_BASE_URL}/users/login`,
        { email, senha }
      );
      localStorage.setItem("currentUserId", response.data._id);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao fazer login.");
    }
  },

  async register(
    nome: string,
    email: string,
    senha: string
  ): Promise<UserData> {
    try {
      const response = await axios.post<UserData>(
        `${API_BASE_URL}/users/register`,
        { nome, email, senha }
      );
      localStorage.setItem("currentUserId", response.data._id);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao registrar.");
    }
  },

  logout(): void {
    localStorage.removeItem("currentUserId");
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem("currentUserId");
  },

  async getCurrentUser(): Promise<UserData | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return null;
    }
    try {
      const response = await axios.get<UserData>(
        `${API_BASE_URL}/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar usuário atual:", error);
      this.logout();
      return null;
    }
  },
};
