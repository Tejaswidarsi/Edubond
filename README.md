# 🎓 EduBond – Donor–Student Sponsorship Platform

EduBond is a full-stack web application designed to connect **donors** with **students** who need financial assistance for education. The platform enables transparent sponsorship, real-time tracking, and automated finance workflows.

---

## 🚀 Features

- 👥 **Donor–Student Sponsorship Platform**
  - Supports 50+ donors and 30+ students
- 🔄 **Automated Finance Requests**
  - Reduced manual work by **40%**
- 📊 **Real-Time Tracking**
  - Live updates of student funding status
- 💳 **Secure Payments**
  - Integrated with **Razorpay**
- 🧩 **RESTful APIs**
  - Well-structured backend APIs for data handling
- 📱 **Responsive UI**
  - Built with ReactJS for smooth user experience

---

## 🛠 Tech Stack

**Frontend**
- ReactJS
- HTML5, CSS3, JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Payment Gateway**
- Razorpay

---

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Tejaswidarsi/EduBond.git
cd EduBond
```

### 2️⃣ Install Dependencies

**Frontend**

cd client
npm install


**Backend**

cd ../server
npm install

**Environment Variables**

Create a .env file inside the server folder:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
UPLOAD_DIR=./uploads
```
▶️ Run the Application

_Start Backend_

cd server
node server.js


_Start Frontend_

cd client
npm start

```
Open in browser:
http://localhost:3000
```
