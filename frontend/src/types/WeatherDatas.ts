/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  sys: {
    country: string;
  };
}

export interface WeatherDataForecast {
  city: {
    name: string;
    country: string;
  };
  list: {
    [x: string]: any;
    dt_txt: string;
    main: {
      temp(temp: any): import("react").ReactNode;
      temp_min: number;
      temp_max: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

export interface UserData {
  _id: string;
  nome: string;
  email: string;
  cidades: LocalidadeData[];
}

export interface LocalidadeData {
  _id: string;
  nome: string;
  estado?: string;
  pais?: string;
  usuario: string;
  alertas: AlertaData[];
}

export interface AlertaData {
  _id: string;
  temperatura: number;
  umidade: number;
  pressao: number;
  descricao: string;
  horario: string;
  localidade: string;
}
