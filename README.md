# TaskFlow — Enterprise Task Management Platform
An enterprise-grade, high-performance task management web application built with **Angular 21**, **NgRx Signals**, and a clean, high-contrast **Light Enterprise Design System** inspired by Linear and Jira.

---

## Features

- ** Signal-Driven Architecture**: Powered by Angular 21 `signal()`, `computed()`, and reactive state management for zero-overhead change detection.
- **Real-Time Analytics Dashboard**: Live KPI metric cards (Total, In Progress, Completed, Overdue), priority progress bars, and recent activity monitoring.
- **Full Task CRUD & Operations**: Complete workflow to create, edit, inline-complete, filter, sort, and delete tasks backed by a REST API.
- **Advanced Search & Filter Toolbar**: Real-time keyword search, status tab filtering, priority selection, and flexible sorting (date, priority, title).
- **Light Enterprise Design System**: Crisp white and slate surface layers with high-contrast typography (Inter font), semantic badges, and smooth micro-animations.
- **Fully Responsive Across All Devices**: Native off-canvas drawer overlay on mobile (`<768px`) with backdrop blur, touch-scrollable status tabs, and adaptive grid columns.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Angular 21 (Standalone Components) |
| **Language** | TypeScript 5.9 |
| **State Management** | NgRx Signals (`signal()`, `computed()`) |
| **Form Handling** | Angular Reactive Forms (`FormBuilder`, `Validators`) |
| **Styling** | SCSS with CSS Custom Properties (Design Tokens) |
| **Mock Backend** | JSON-Server (REST API on `http://localhost:3000`) |

---

## Quick Start & Local Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### 1. Clone the Repository

```bash
git clone https://github.com/Oguntayo/angular-todo.git
cd angular-todo
```

> **Note**: If your root folder contains `enterprise-todo`, navigate into it:
> ```bash
> cd enterprise-todo
> ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file to create your local `.env` configuration file:

```bash
cp .env.example .env
```

---

## Running the Application

To run the application locally, you will start the **Mock Backend API** and the **Angular Frontend**.

### Step 1: Start the Mock REST API Server

In a terminal window, start `json-server` (runs on port `3000`):

```bash
npm run mock-api
```

*The API server will serve the initial dataset from `backend/db.json` at `http://localhost:3000/todos`.*

### Step 2: Start the Angular Development Server

In a second terminal window, run:

```bash
npm start
```

Open your browser and navigate to:
```
http://localhost:4200/
```

---

## Build for Production

To create an optimized production bundle:

```bash
npm run build
```

The compiled build artifacts will be generated in the `dist/enterprise-todo/` directory.

---

## Project Architecture

```
enterprise-todo/
├── backend/
│   └── db.json               # Seed database for json-server REST API
├── src/
│   ├── app/
│   │   ├── core/             # Core services, models, guards & interceptors
│   │   ├── features/
│   │   │   ├── dashboard/    # Dashboard analytics page & routes
│   │   │   └── todos/        # Task management page, store, service & components
│   │   │       ├── components/
│   │   │       │   ├── todo-card/   # Task card component
│   │   │       │   └── todo-form/   # Modal form for create/edit
│   │   │       ├── models/          # Interfaces & Enums (Priority, Status)
│   │   │       ├── services/        # TodoService (HttpClient CRUD)
│   │   │       └── store/           # TodoStore (Signals & computed state)
│   │   ├── layout/           # App Shell, Header, Sidebar (Drawer), Footer
│   │   └── shared/           # Reusable UI components (Badge, Spinner, ConfirmDialog)
│   ├── styles.scss           # Global CSS Custom Property Design Tokens
│   ├── index.html            # Google Fonts & SEO Meta tags
│   └── main.ts               # Application entrypoint
├── angular.json              # Angular CLI configuration
└── package.json              # Dependencies & NPM scripts
```

---

## NPM Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Angular development server on port 4200. |
| `npm run mock-api` | Starts the json-server REST backend on port 3000. |
| `npm run build` | Compiles the production build into `dist/`. |
| `npm run watch` | Builds the project in development mode and watches for changes. |
| `npm test` | Runs unit tests via Vitest / Angular test suite. |

---

## License

Distributed under the MIT License. See `LICENSE` for details.
