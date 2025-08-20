/* eslint-disable @typescript-eslint/no-explicit-any */
import "../App2.css";
import WeatherInfo from "../components/WeatherInfo/WeatherInfo";
import WeatherInfoForecast from "../components/WeatherInfoForecast/WeatherInfoForecast";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import type {
  WeatherData,
  WeatherDataForecast,
  UserData,
  LocalidadeData,
  AlertaData,
} from "../types/WeatherDatas";

function Home2() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] =
    useState<WeatherDataForecast | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [savedCities, setSavedCities] = useState<LocalidadeData[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cityAlerts, setCityAlerts] = useState<AlertaData[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  const [busca, setBusca] = useState<string>("");

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:3333/api";

  const getAllCities = useCallback(() => {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/distritos/`)
      .then((response) => response.json())
      .then((data) => {
        const nomes = data.map((cidade) => cidade.municipio.nome);

        setCidades(nomes);
      });
  }, []);

  const loadUser = useCallback(async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setSavedCities(user.cidades || []);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    async function fetchCityAlerts() {
      if (selectedCityId) {
        try {
          const response = await axios.get<{ alertas: AlertaData[] }>(
            `${API_BASE_URL}/alertas/${selectedCityId}`
          );
          setCityAlerts(response.data.alertas);
        } catch (error) {
          console.error("Erro ao buscar alertas da cidade:", error);
          setCityAlerts([]);
        }
      } else {
        setCityAlerts([]);
      }
    }
    fetchCityAlerts();

    getAllCities();
  }, [selectedCityId, getAllCities]);

  const handleFocusBusca = () => {
    console.log("busca");
  };

  async function searchCity() {
    const city = inputRef.current?.value;
    if (!city) return;

    const key = "a23eca6824140447a7bc8a3fb2139eb6";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`;

    try {
      const response = await axios.get<WeatherData>(url);
      const responseForecast = await axios.get<WeatherDataForecast>(
        urlForecast
      );

      setWeather(response.data);
      setWeatherForecast(responseForecast.data);

      if (currentUser) {
        let currentLocalidade: LocalidadeData | undefined;
        const existingLocalidade = savedCities.find(
          (lc) => lc.nome.toLowerCase() === city.toLowerCase()
        );

        if (existingLocalidade) {
          currentLocalidade = existingLocalidade;
        } else {
          try {
            const newLocalidadeResponse = await axios.post<LocalidadeData>(
              `${API_BASE_URL}/localidades`,
              {
                nome: response.data.name,
                estado: response.data.sys.country,
                pais: response.data.sys.country,
                usuario: currentUser._id,
              }
            );
            currentLocalidade = newLocalidadeResponse.data;
            setSavedCities((prev) => [...prev, newLocalidadeResponse.data]);
          } catch (error: any) {
            if (
              error.response &&
              error.response.status === 409 &&
              error.response.data.localidade
            ) {
              currentLocalidade = error.response.data.localidade;
            } else {
              console.error("Erro ao salvar nova localidade:", error);
              return;
            }
          }
        }

        if (currentLocalidade) {
          try {
            const newAlertaResponse = await axios.post<AlertaData>(
              `${API_BASE_URL}/alertas`,
              {
                temperatura: response.data.main.temp,
                umidade: response.data.main.humidity,
                pressao: response.data.main.pressure,
                descricao: response.data.weather[0].description,
                localidade: currentLocalidade._id,
              }
            );
            if (selectedCityId === currentLocalidade._id) {
              setCityAlerts((prev) => [...prev, newAlertaResponse.data]);
            }
          } catch (error) {
            console.error("Erro ao salvar alerta:", error);
          }
          setSelectedCityId(currentLocalidade._id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar o clima:", error);
      setWeather(null);
      setWeatherForecast(null);
    }
  }

  const cidadesFiltradas = busca
    ? cidades
        .filter((cidade) => cidade.toLowerCase().includes(busca.toLowerCase()))
        .slice(0, 3)
    : [];

  if (!currentUser) {
    return <p>Carregando usuário...</p>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Monitoramento Climático</h1>
        <p onClick={() => navigate("/account")} className="user-info">
          Bem-vindo, <b>{currentUser.nome}!</b>
        </p>
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite sua cidade"
            onChange={(e) => setBusca(e.target.value)}
            value={busca}
            onFocus={() => handleFocusBusca()}
          />
          <button type="button" onClick={searchCity}>
            Buscar
          </button>
        </div>
        {cidadesFiltradas.length > 0 && (
          <ul style={{ border: "1px solid #ccc", margin: 0, padding: "8px" }}>
            {cidadesFiltradas.map((cidade, index) => (
              <li
                key={index}
                style={{
                  listStyle: "none",
                  padding: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setBusca(cidade)}
              >
                {cidade}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="content">
        <aside className="sidebar">
          <h3>Minhas Cidades</h3>
          <ul className="city-list">
            {savedCities.length > 0 ? (
              savedCities.map((city) => (
                <li
                  key={city._id}
                  onClick={() => setSelectedCityId(city._id)}
                  className={selectedCityId === city._id ? "selected-city" : ""}
                >
                  {city.nome}
                </li>
              ))
            ) : (
              <p>Nenhuma cidade salva.</p>
            )}
          </ul>
        </aside>

        <main className="main-content">
          {weather && <WeatherInfo weather={weather} />}
          {weatherForecast && (
            <WeatherInfoForecast weatherForecast={weatherForecast} />
          )}

          {selectedCityId && (
            <div className="city-alerts-history">
              <h3>
                Histórico de Alertas para{" "}
                {savedCities.find((c) => c._id === selectedCityId)?.nome}
              </h3>
              {cityAlerts.length > 0 ? (
                <ul className="alerts-list">
                  {cityAlerts.map((alerta) => (
                    <li key={alerta._id} className="alert-item">
                      <span>
                        {new Date(alerta.horario).toLocaleDateString()}{" "}
                        {new Date(alerta.horario).toLocaleTimeString()}
                      </span>
                      <span>Temp: {Math.round(alerta.temperatura)}°C</span>
                      <span>Umidade: {alerta.umidade}%</span>
                      <span>{alerta.descricao}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum alerta registrado ainda.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home2;
