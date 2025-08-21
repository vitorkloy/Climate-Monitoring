import "./Account.css";
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
    <div className="account-container">
      <h1>Monitoramento Climático</h1>

      <div className="account-form-container">
        <h2>Bem-vindo, {currentUser.nome}</h2>

        {/* Usuário */}
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
            aria-label="Editar usuário"
            onClick={() => setEditing(true)}
          >
            ✏️
          </button>
        </div>

        {/* Email */}
        <label htmlFor="email">Email:</label>
        <div className="field-row">
          {editing ? (
            <input
              id="email"
              type="email"
              defaultValue={currentUser.email}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          ) : (
            <input id="email" type="email" value={currentUser.email} disabled />
          )}
          <button
            className="icon-btn"
            type="button"
            aria-label="Editar email"
            onClick={() => setEditing(true)}
          >
            ✏️
          </button>
        </div>

        {/* Senha */}
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

        {/* Botões */}
        <div className="account-actions">
          <button
            onClick={handleSave}
            className="save-account-btn"
            disabled={!editing}
          >
            Salvar
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
          <button onClick={() => navigate("/home")} className="back-btn">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
