# 🏡 Farm Rental & Sales Application

A full-stack web application that allows users to **rent or sell farms**, built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## 🚀 Features

- 👨‍🌾 Add new farms with details (name, description, images, location, contact number).
- 🔍 Search farms by **name or status (For Sale / For Rent / All)**.
- 📷 Upload and store farm images in the database.
- 🛡️ User authentication system (Sign Up / Login / Logout).
- 👤 User profile page with editable information.
- 📱 Responsive design for desktop and mobile devices.

---

## 🛠️ Technologies Used

### **Backend**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)

### **Frontend**
- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)

### **Others**
- [JWT](https://jwt.io/) for authentication
- [Multer](https://github.com/expressjs/multer) for image upload
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for password hashing

---

## 📂 Project Structure
project-root/
│── server/ # Backend code (Node + Express)
│ ├── Models/ # Database models (Mongoose Schemas)
│ ├── Routes/ # API routes
│ └── server.js # Server entry point
│
│── client/ # Frontend code (React)
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Application pages
│ │ └── App.js # Main React component
│
│── README.md

---

## ⚙️ How to Run the Project

### 1. Clone the repository
``bash
git clone https://github.com/username/farm-rent-sale.git
cd farm-rent-sale

### 2. Install dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
 ### 3. Setup Environment Variables

Create a .env file inside the server folder with the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000

### 4. Start the application
# Start Backend
cd server
npm start

# Start Frontend
cd client
npm start
### 👨‍💻 Developer

Name: Mohammad Ayham Kassar

📧 Email: kassaeraeham067@gmail.com

🌐 GitHub : https://github.com/Ayhamkassar


