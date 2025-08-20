import "../App.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import type { UserData } from "../types/WeatherDatas";

function Account() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  //const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [updatedNome, setUpdatedName] = useState<string>("");
  const [updatedEmail, setUpdatedEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  //const API_BASE_URL = "http://localhost:3333/api";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editing || !currentUser) {
      return;
    }
    if (!updatedNome && !updatedEmail && !password) {
      return alert("Por favor, preencha todos os campos.");
    }

    try {
      console.log(password);
      const updatedUser = await AuthService.update(
        updatedEmail || currentUser.email,
        updatedNome || currentUser.nome,
        password || ""
      );
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return alert(error || "Erro ao atualizar usuário.");
    }

    setEditing(false);
  };

  const loadUser = useCallback(async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate("/");
  };

  if (!currentUser) {
    return <p>Carregando usuário...</p>;
  }

  return (
    <div className="container">
      <h1>Monitoramento Climático</h1>
      <div className="account-form-container">
        <h2>Bem vindo, {currentUser.nome}</h2>
        <label htmlFor="username">Usuário:</label>
        <div className="field-row">
          {editing ? (
            <input
              id="username"
              type="text"
              defaultValue={currentUser.nome}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          ) : (
            <input
              id="username"
              type="text"
              value={currentUser.nome}
              disabled
            />
          )}
          <button
            className="icon-btn"
            type="button"
            aria-label="Editar"
            onClick={() => setEditing(true)}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm14.71-9.04c.39-.39.39-1.02 0-1.41l-1.51-1.51a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75 1.3-1.96z" />
            </svg>
          </button>
        </div>

        <label htmlFor="email">Email:</label>
        <div className="field-row">
          {editing ? (
            <input
              id="email"
              type="email"
              defaultValue={currentUser.nome}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          ) : (
            <input id="email" type="email" value={currentUser.email} disabled />
          )}
          <button
            className="icon-btn"
            type="button"
            aria-label="Editar"
            onClick={() => setEditing(true)}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm14.71-9.04c.39-.39.39-1.02 0-1.41l-1.51-1.51a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75 1.3-1.96z" />
            </svg>
          </button>
        </div>

        <label htmlFor="password">Senha:</label>
        <div className="field-row">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e)}
            placeholder="Digite sua senha para salvar"
          />
        </div>

        <button
          onClick={handleSave}
          className="save-account-btn"
          disabled={!editing}
        >
          Salvar
        </button>
        <button onClick={handleLogout} className="logout-button-account">
          Sair
        </button>
      </div>
      <button onClick={() => navigate("/home")}>Voltar</button>
    </div>
  );
}

export default Account;
