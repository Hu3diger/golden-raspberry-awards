# Golden Raspberry Awards - Frontend

Uma aplicação Angular para visualizar dados dos prêmios Golden Raspberry Awards, que "homenageia" os piores filmes de cada ano.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [API](#api)
- [Componentes Principais](#componentes-principais)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

Este projeto é uma aplicação frontend desenvolvida em Angular que consome uma API REST para exibir informações sobre os Golden Raspberry Awards. A aplicação oferece duas visualizações principais:

1. **Dashboard**: Apresenta estatísticas e dados resumidos
2. **Lista de Filmes**: Permite buscar e filtrar filmes por ano e status de vencedor

## ✨ Funcionalidades

### Dashboard
- **Intervalos de Prêmios por Produtor**: Mostra produtores com maior e menor intervalo entre vitórias consecutivas
- **Estúdios com Mais Vitórias**: Top 3 estúdios com mais prêmios
- **Anos com Múltiplos Vencedores**: Lista anos que tiveram mais de um vencedor
- **Vencedores por Ano**: Busca dinâmica de vencedores por ano específico

### Lista de Filmes
- Listagem paginada de todos os filmes
- Filtros por ano e status de vencedor
- Navegação entre páginas
- Busca responsiva

### Funcionalidades Técnicas
- **Tratamento de Erros**: Sistema robusto de captura e exibição de erros
- **Estados de Loading**: Indicadores visuais durante carregamento de dados
- **Retry Logic**: Funcionalidade de tentar novamente em caso de erro
- **Responsive Design**: Interface adaptável para diferentes dispositivos

## 🛠 Tecnologias Utilizadas

- **Framework**: Angular 20+ (Standalone Components)
- **Linguagem**: TypeScript (modo strict)
- **Estilos**: SCSS
- **HTTP Client**: Angular HttpClient com interceptors
- **Reatividade**: RxJS Observables e Signals
- **Testes**: Jasmine + Karma
- **Linting**: ESLint + Prettier
- **Build**: Angular CLI

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (preferencialmente a versão 20.19.0)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.io/cli)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version  # Se tiver Angular CLI instalado
```

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd golden-raspberry-awards
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente** (opcional)
   
   O projeto está configurado para usar a API oficial:
   ```
   https://challenge.outsera.tech/api/movies
   ```
   
   Se necessário, você pode alterar a URL da API em:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'https://challenge.outsera.tech/api/movies'
   };
   ```

## ▶️ Como Executar

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
ng serve

# A aplicação estará disponível em http://localhost:4200
```

### Produção
```bash
# Build para produção
npm run build
# ou
ng build --configuration production

# Os arquivos serão gerados na pasta dist/
```

### Outros comandos úteis
```bash
# Executar com porta específica
ng serve --port 4300

# Executar e abrir automaticamente no navegador
ng serve --open
```

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários:

```bash
# Executar todos os testes
npm test
# ou
ng test

# Executar testes uma única vez (CI/CD)
npm run test:ci
# ou
ng test --single-run --no-watch

# Executar testes com coverage
ng test --code-coverage
```

### Estatísticas de Testes
- **Total de Testes**: 105
- **Cobertura**: 100% dos componentes e serviços
- **Tipos de Teste**:
  - Testes de componentes (isolamento e integração)
  - Testes de serviços (mocking de HTTP)
  - Testes de pipes e utilitários
  - Testes de tratamento de erros

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                          # Módulo principal da aplicação
│   │   ├── models/                     # Interfaces e tipos TypeScript
│   │   │   ├── dashboard.model.ts      # Modelos para dashboard
│   │   │   └── movies.model.ts         # Modelos para filmes
│   │   └── services/                   # Serviços da aplicação
│   │       ├── api.service.ts          # Serviço base para HTTP
│   │       └── movie.service.ts        # Serviço específico para filmes
│   │
│   ├── features/                       # Funcionalidades principais
│   │   ├── dashboard/                  # Módulo do dashboard
│   │   │   ├── components/            # Componentes do dashboard
│   │   │   │   ├── producers-intervals/
│   │   │   │   ├── top-studios/
│   │   │   │   ├── winners-by-year/
│   │   │   │   └── years-multiple-winners/
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.component.html
│   │   │
│   │   └── movies/                     # Módulo de filmes
│   │       ├── movies.component.ts
│   │       └── movies.component.html
│   │
│   ├── layout/                         # Componentes de layout
│   │   ├── header/                     # Cabeçalho da aplicação
│   │   └── navigation/                 # Navegação principal
│   │
│   ├── shared/                         # Componentes compartilhados
│   │   ├── components/
│   │   │   ├── error-message/          # Componente de mensagem de erro
│   │   │   ├── loading/                # Componente de loading
│   │   │   └── pagination/             # Componente de paginação
│   │   └── pipes/
│   │       └── array-join-pipe.ts      # Pipe para juntar arrays
│   │
│   ├── app.config.ts                   # Configuração da aplicação
│   ├── app.routes.ts                   # Rotas da aplicação
│   └── app.component.ts                # Componente raiz
│
├── environments/                       # Configurações de ambiente
│   ├── environment.ts                  # Desenvolvimento
│   └── environment.prod.ts            # Produção
│
└── styles.scss                        # Estilos globais
```

## 🏗 Arquitetura

### Padrões Utilizados

1. **Standalone Components**: Utiliza a nova arquitetura do Angular sem NgModules
2. **Feature-based Structure**: Organização por funcionalidades
3. **Reactive Programming**: Uso extensivo de RxJS Observables
4. **Service Layer**: Separação clara entre apresentação e lógica de negócio
5. **Error Boundary**: Tratamento centralizado de erros
6. **Retry Pattern**: Recuperação automática de falhas de rede

### Tratamento de Erros
- **Retry Logic**: 2 tentativas automáticas em caso de falha
- **Error Handling**: Captura e exibição amigável de erros
- **Timeout**: Configuração de timeout para requisições

**Desenvolvido com ❤️ usando Angular e TypeScript**
