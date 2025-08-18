# Climate Monitoring

Climate Monitoring é uma aplicação web desenvolvida para monitorar as condições climáticas em tempo real com base na localização do usuário. O projeto permite que os usuários se cadastrem, façam login e salvem cidades para receber alertas meteorológicos.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite  
- **Backend**: Node.js, Express, Mongoose  
- **Banco de Dados**: MongoDB  

---

## 📦 Instalação

Para rodar o projeto localmente, siga os passos abaixo:

### 1. Clone o repositório
```bash
git clone https://github.com/vitorkloy/Climate-Monitoring
```

### 2. Navegue até o diretório do projeto
```bash
cd Climate-Monitoring
```

### 3. Instale as dependências do Backend
```bash
cd backend
npm install
```

### 4. Configure o Banco de Dados
- Crie um cluster no MongoDB Atlas ou instale o MongoDB localmente.
- Atualize o arquivo `.env` na pasta `backend` com sua URI do MongoDB.

### 5. Inicie o servidor Backend
```bash
npm start
```

### 6. Instale as dependências do Frontend
```bash
cd frontend
npm install
```

### 7. Inicie o servidor de desenvolvimento do Frontend
```bash
npm run dev
```

A aplicação estará disponível em http://localhost:5173.

---

## 🔧 Funcionalidades

- Cadastro e login de usuários
- Monitoramento em tempo real do clima via API
- Salvar cidades para verificar os dados meteorológicos
- Histórico para cada cidade salva
- Interface intuitiva e responsiva

---

## Imagens

![Interface do sistema, página de Login](https://github.com/vitorkloy/Climate-Monitoring/blob/main/images/SignIn.png)
![Interface do sistema, página de Cadastro](https://github.com/vitorkloy/Climate-Monitoring/blob/main/images/SignUp.png)
![Interface do sistema, página principal do sistema](https://github.com/vitorkloy/Climate-Monitoring/blob/main/images/Home.png)
