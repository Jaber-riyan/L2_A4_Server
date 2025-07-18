# 📚 LibraNova - Library Management API

LibraNova is a robust RESTful API for managing a digital library system. It allows users to **sign up**, **sign in**, manage **books**, and perform **borrowing operations** efficiently.

---

## 🔧 Technologies Used

### 🛠 Backend Stack
- **Node.js** with **Express.js** (v5)
- **MongoDB** with **Mongoose**
- **Zod** – Schema validation
- **Bcrypt** – Password hashing
- **Validator** – Email and input validation
- **Dotenv** – Environment variable support
- **CORS** – Cross-origin requests
- **Morgan** – Logging HTTP requests

### ⚙ Development Tools
- **TypeScript**
- **ts-node-dev** & **tsx** – For development runtime
- **@types/** – Type definitions for type safety

---

## 📂 Folder Structure (Sample)
```
LibraNova/
│
├── app/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── validations/
│
├── config/
├── server.ts
├── .env
└── package.json
```

---

## 🔐 Authentication

### ➤ Signup
`POST /api/users/signup`

**Body:**
```json
{
  "name": "Jaber",
  "email": "jaber@gmail.com",
  "password": "12345678",
  "photoURL": "https://i.ibb.co/album/your-photo.jpg"
}
```

### ➤ Signin
`POST /api/users/signin`

**Body:**
```json
{
  "email": "jaber@example.com",
  "password": "12345678"
}
```

---

## 📘 Books API

### ➤ Create Book  
`POST /api/books`

**Body:**
```json
{
  "title": "C Programming: The Good Parts",
  "author": "Douglas Crockford",
  "genre": "Programming",
  "isbn": "97805965sdf",
  "description": "A deep dive into C Programming best features.",
  "copies": 8
}
```

---

### ➤ Update Book  
`PATCH /api/books/:bookId`

**Body:**
```json
{
  "title": "JavaScript: The Good Parts",
  "author": "Douglas Crockford",
  "description": "A deep dive into JavaScript's best features.",
  "copies": 1
}
```

---

### ➤ Delete Book  
`DELETE /api/books/:bookId`

---

### ➤ Get All Books  
`GET /api/books`

---

### ➤ Get Single Book  
`GET /api/books/:bookId`

---

### ➤ Borrow Book  
`POST /api/books/borrow/:bookId`

**Body:**
```json
{
  "quantity": 1,
  "dueDate": "2025-07-01"
}
```

---

### ➤ Borrowed Summary  
`GET /api/books/summary/borrowed`

---

## 🧪 Testing with Postman

A full Postman collection is available containing:
- Auth flows
- All Book CRUD operations
- Borrowing and summary endpoints

> Replace `{{baseURL}}` with `https://libra-nova-server.vercel.app` or your deployed backend URL.

---

## 🚀 Getting Started

### 📦 Install Dependencies
```bash
npm install
```

### ▶ Run in Development
```bash
npm run dev
```

---

## 📬 License

MIT License