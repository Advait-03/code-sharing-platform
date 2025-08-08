## 📧 Contact & Live Demo

**Live Demo:** [CodeSnippet HUB](https://codenippet-hub.netlify.app/)

Check out the live, deployed version of the app hosted on Netlify!

# Code Snippet HUB 🚀

Built with **React**, **Node.js/Express**, and supports **Dark/Light mode**, **Live Preview**, and **Search/Filter**.

---

## ✨ Features

- Browse community snippets with language filter and search bar.
- Create your own snippets with HTML, CSS, and JavaScript editors.
- Instant live preview of code as you type.
- Dark/Light theme toggle with persistent preference.
- **Click snippet cards to open detailed view and copy code.
- Responsive design for desktop and mobile.
- Backend API to store and retrieve snippets.

---

## 🛠 Tech Stack

Frontend
- React (with Hooks)
- Tailwind CSS for styling
- PrismJS for syntax highlighting
- react-simple-code-editor for editing code

Backend
- Node.js
- Express.js
- MongoDB (or your chosen database) for storing snippets

---

## 📂 Project Structure

project-root/
│
├── frontend/ # React app
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
│
├── backend/ # Express API
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ ├── server.js
│ └── package.json
│
└── README.md


---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME


### 2️⃣ Frontend Setup

cd frontend
npm install
npm start

cd frontend
npm install
npm start


### 3️⃣ Backend Setup

cd backend
npm install
npm start


> The backend server will typically run on `http://localhost:5000`  
> The frontend React app will run on `http://localhost:3000`

Ensure your backend `.env` is configured with:

PORT=5000
MONGO_URI=your_connection_string
