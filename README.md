# 🍬 Sweet Shop Management System

---

## 📖 Project Overview
The **Sweet Shop Management System** is a full-stack web application for managing sweet shop operations:  
- User authentication  
- Role-based dashboards (User / Admin)  
- Sweet inventory management  
- Search, filter, purchase, and restock functionality  

This project was developed as part of the **Incubyte Assessment Kata**, focusing on **Test-Driven Development (TDD)**, clean coding, and responsible AI usage.

---

## 🔁 Test-Driven Development (TDD)
**TDD Workflow:** Red → Green → Refactor  

1. **Red:** Write a failing test  
2. **Green:** Implement minimum code to pass  
3. **Refactor:** Clean and optimize code while keeping tests passing  

**Benefits:**  
- ✅ Clean, readable code  
- ✅ Early bug detection  
- ✅ Confidence in code through automated tests  

---

## 🚀 Tech Stack

**Backend**  
- Node.js + Express + TypeScript  
- MongoDB (Mongoose ODM)  
- JWT Authentication + bcrypt  
- Jest + Supertest for testing  

**Frontend**  
- React (Vite + TypeScript)  
- Tailwind CSS for responsive UI  
- React Router for navigation  
- Vitest + Testing Library for component testing  

---

## 🛠 Features

### 🔑 Authentication
- Register: `POST /api/auth/register`  
- Login: `POST /api/auth/login`  
- JWT-based authentication  
- Role-based access (Customer / Admin)  

### 🍭 Admin Sweet Management
- Add sweet: `POST /api/sweets`  
- Update sweet: `PUT /api/sweets/:id`  
- Delete sweet: `DELETE /api/sweets/:id`  
- Restock sweet: `POST /api/sweets/:id/restock`  

### 🛒 Customer Features
- View all sweets: `GET /api/sweets`  
- Search / Filter sweets: `GET /api/sweets/search`  
- Purchase sweet: `POST /api/sweets/:id/purchase`  

---

## ⚡ API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST   | /api/auth/register | Register new user | Public |
| POST   | /api/auth/login | Login user | Public |
| POST   | /api/sweets | Add a sweet | Admin |
| GET    | /api/sweets | List all sweets | Auth |
| GET    | /api/sweets/search | Search sweets | Auth |
| PUT    | /api/sweets/:id | Update sweet | Admin |
| DELETE | /api/sweets/:id | Delete sweet | Admin |
| POST   | /api/sweets/:id/purchase | Purchase sweet | Auth |
| POST   | /api/sweets/:id/restock | Restock sweet | Admin |

---

## 📸 Test Screenshots

**Backend Tests (Jest + Supertest)**  
![Backend Tests](./asserts/backend_test.png)

**Frontend Tests (Vitest + Testing Library)**  
![Frontend Tests](./asserts/frontend_test.png)

---

## 🖥 Application Screenshots

**Admin Dashboard – Add Sweet+Sweet Inventory**  
![Admin-dashboard](./asserts/admin.png)


**User Dashboard – Purchase Sweets**  
![User-dashboard](./asserts/Sweet.png)

**Search & Filter Functionality**  
![Search Filter](./asserts/Search&filter.png)


---

## ⚙️ Installation & Testing (All-in-One Terminal)

```bash
# -------------------------------
# 🏗 Backend Setup
# -------------------------------
cd sweet-shop-backend
npm install                 # Install dependencies
npm install jest supertest ts-jest @types/jest --save-dev  # Install testing libraries
npm run dev                 # Run backend server

# -------------------------------
# 🏗 Frontend Setup
# -------------------------------
cd ../sweet-shop-frontend
npm install                                        # Install dependencies
npm install vitest @testing-library/react @testing-library/jest-dom --save-dev  # Install testing libraries
npm run dev                                        # Run frontend server

# -------------------------------
# 🌿 Environment Variables
# -------------------------------
# Backend (.env)
echo "PORT=5000" >> .env
echo "MONGO_URI=<your-mongodb-url>" >> .env
echo "JWT_SECRET=<your_secret_key>" >> .env

# Frontend (.env)
echo "VITE_API_URL=http://localhost:5000/api" >> .env

# -------------------------------
# 🧪 Running Tests
# -------------------------------
# Backend Tests (Jest + Supertest)
cd ../sweet-shop-backend
npm test          # Runs all backend test cases

# Frontend Tests (Vitest + Testing Library)
cd ../sweet-shop-frontend
npm run test      # Runs all frontend test cases
```

## 🤖 AI Usage

**Tools:** ChatGPT

**Usage:**
- Generated boilerplate for backend controllers/routes/models
- Created Jest + Vitest tests for TDD flow
- Designed React components Layout (Login, Signup, Dashboard) 
- Debugging and TypeScript fixes


**Reflection:**  
AI accelerated boilerplate creation, reduced repetitive coding, and helped focus on **business logic and architecture**. All code was manually reviewed and tested.

---

## 🚀 Final Thoughts

This project demonstrates:  
- ✅ Test-Driven Development (TDD)  
- ✅ Clean, modular code design  
- ✅ Modern frontend UI with React + Tailwind  
- ✅ End-to-end integration between backend and frontend  

---

## 🙏 Acknowledgements

Thank you **Incubyte** for this assessment and for encouraging **TDD**, **clean coding**, and **AI-assisted development**.  

— **Milan Vadhel**
