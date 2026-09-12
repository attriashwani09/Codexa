<div align="center">

# 🧠 Codexa

**A full-stack online coding platform for practicing, solving, and improving DSA problems.**

Browse coding problems, write and execute code directly in the browser, track solved problems, and get AI-powered debugging assistance — all in one place.

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

---

## 📖 About

**Codexa** is a full-stack online coding platform designed to help developers practice Data Structures and Algorithms in an interactive coding environment.

Users can browse coding problems, filter them based on difficulty and tags, write solutions using the **Monaco Editor**, and execute their code against test cases using the **Judge0 API**.

Codexa also includes an **AI-powered coding assistant using Gemini API** that analyzes the user's code along with the problem statement and test cases to provide debugging guidance, explanations, and time/space complexity optimization suggestions.

The platform also provides an **admin portal** for creating, updating, and deleting coding problems.

---

## ✨ Features

- 🔐 **Authentication & Authorization** — Secure JWT-based authentication with protected routes and session management
- 🧩 **Problem Catalog** — Browse and filter coding problems based on difficulty, tags, and solved status
- 💻 **Online Code Editor** — Write code directly in the browser using Monaco Editor
- ⚡ **Code Execution & Judging** — Execute submitted code against test cases using the Judge0 API
- ✅ **Submission Results** — Get execution results such as accepted, rejected, and runtime errors
- 📊 **Solved Problem Tracking** — Track which coding problems have been solved
- 🛠️ **Admin Portal** — Create, update, and delete coding problems
- 🤖 **AI Coding Assistant** — Gemini-powered assistant for debugging, explanations, and optimization suggestions
- 🔒 **Session Management** — Redis-based session data with expiring session information
- 📱 **Responsive UI** — Clean and responsive interface built using Tailwind CSS

---

## 🏗️ Tech Stack

### Frontend

- React.js
- JavaScript
- Tailwind CSS
- Monaco Editor

### Backend

- Node.js
- Express.js
- REST APIs

### Database & Session Management

- MongoDB
- Mongoose
- Redis

### Authentication

- JWT

### APIs & AI

- Judge0 API
- Gemini API

---

## 🗂️ Project Structure

```text
Codexa/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed/configured:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- Redis
- Judge0 API
- Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/attriashwani09/Codexa
cd Codexa
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

---

### 3. Configure Environment Variables

Add the following variables to your `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_KEY=your_jwt_secret

REDIS_KEY=your_redis_key

JUDGE0_URL=your_judge0_api_url

GEMINI_KEY=your_gemini_api_key
```

> ⚠️ Never commit your `.env` file or expose your API keys publicly.

---

### 4. Start the Backend

```bash
npm run dev
```

If your backend does not have a `dev` script, use the command defined in your `package.json`.

---

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local development URL provided by your frontend development server.

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Port on which the backend server runs |
| `MONGODB_URI` | MongoDB database connection string |
| `JWT_KEY` | Secret key used for JWT authentication |
| `REDIS_KEY` | Redis configuration/key used for session management |
| `JUDGE0_URL` | Judge0 API endpoint used for code execution |
| `GEMINI_KEY` | Gemini API key used by the AI coding assistant |

> ⚠️ **Security:** Never commit your `.env` file to GitHub. Add `.env` to your `.gitignore`.

Example:

```gitignore
.env
node_modules/
```

---

## 💻 Code Execution Flow

Codexa uses **Monaco Editor** to provide an in-browser coding environment.

The code execution flow works approximately like this:

```text
User
  ↓
Monaco Editor
  ↓
Frontend
  ↓
Backend API
  ↓
Judge0 API
  ↓
Code Compilation & Execution
  ↓
Test Cases
  ↓
Execution Result
  ↓
Frontend
```

The platform handles execution results such as:

- ✅ Accepted
- ❌ Rejected / Wrong Answer
- ⚠️ Runtime Error

---

## 🤖 AI Coding Assistant

Codexa includes an AI-powered coding assistant built using the **Gemini API**.

The assistant analyzes relevant coding context such as:

- Problem statement
- User's submitted code
- Test cases
- Execution results

It can provide:

- 🐛 Debugging guidance
- 📖 Code explanations
- ⏱️ Time complexity analysis
- 💾 Space complexity analysis
- ⚡ Optimization suggestions

The goal of the assistant is to help users **understand and improve their solutions**, rather than simply giving them the complete answer.

---

## 🔐 Authentication & Session Management

Codexa uses **JWT-based authentication** to secure user sessions and protected routes.

Redis is used for session-related data with expiring session information.

Protected functionality includes administrative operations such as:

- Creating coding problems
- Updating coding problems
- Deleting coding problems

This provides an additional layer of security around the platform's administrative functionality.

---

## 👨‍💼 Admin Portal

Codexa provides an administrative portal for managing coding problems.

Administrators can:

- ➕ Create new coding problems
- ✏️ Update existing problems
- 🗑️ Delete coding problems
- 🧪 Manage problem test cases
- 📝 Manage problem-related information

Administrative functionality is protected through authentication and authorization.

---

## 🧩 Problem Browsing

Users can browse coding problems and filter them based on:

- Difficulty
- Tags
- Solved status

This makes it easier to find problems according to the user's current practice requirements.

---

## 🧠 What I Learned

Building Codexa helped me gain practical experience in:

- Designing full-stack web applications
- Building REST APIs using Node.js and Express.js
- Working with MongoDB and Mongoose
- Implementing JWT authentication
- Managing session data using Redis
- Integrating third-party APIs
- Integrating Judge0 for online code execution
- Working with Monaco Editor
- Building AI-powered application features using Gemini API
- Designing protected admin functionality
- Building responsive interfaces using React and Tailwind CSS

---

## 🗺️ Future Improvements

- [ ] Add more coding problems
- [ ] Support additional programming languages
- [ ] Add submission history and detailed statistics
- [ ] Add user profiles
- [ ] Add leaderboard functionality
- [ ] Add coding contests
- [ ] Add personalized problem recommendations
- [ ] Improve AI-powered code analysis
- [ ] Add more advanced performance analytics

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 👤 Author

**Ashwani Kumar**

Full Stack Developer

- GitHub: [@attriashwani09](https://github.com/attriashwani09)
- LinkedIn: [Ashwani Kumar](https://www.linkedin.com/in/ashwani-kumar-80144a330/)

---

⭐ If you found Codexa interesting, consider giving the repository a star!
