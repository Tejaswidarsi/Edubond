#  EduBond Sponsor Dashboard

Welcome to the **EduBond Sponsor Dashboard**, a full-stack web application designed to connect sponsors with students who need financial assistance for their education. Sponsors can explore student profiles, make secure payments via Razorpay, and track real-time funding progress.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contact](#contact)

---

## Overview

**EduBond** is a sponsorship platform that bridges the gap between students in need and potential sponsors. It offers:

- Detailed student profiles
- Secure Razorpay integration for donations
- Real-time tracking of donation progress

Built using **React** (frontend), **Node.js** (backend), and **MongoDB** (database), EduBond ensures a seamless and transparent funding process.

---

## Features

- **Student Profiles**: Browse detailed profiles with images, educational background, and funding requirements.
- **Razorpay Integration**: Secure and flexible payment handling via Razorpay API.
- **Real-Time Updates**: Automatically reflects confirmed payments every 10 seconds.
- **Responsive Dashboard**: User-friendly UI to track received and remaining funding.
- **Backend Services**: Handles API routes, payment verification, and database operations.

---

## Prerequisites

Before setting up, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- npm or yarn
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Razorpay Account](https://razorpay.com/) with API keys

---

## ⚙Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/edubond.git
cd edubond
```
### 2. Install Dependencies
Frontend (React Client)
```bash
Copy code
cd client
npm install
```
Backend (Node Server)
```bash
Copy code
cd ../server
npm install
```
## 3. Set Up Environment Variables
Create a .env file in the server directory:

```env
Copy code
PORT=5000
MONGODB_URI=your_mongodb_connection_string
UPLOAD_DIR=./uploads
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Get Razorpay API keys from: Dashboard → Settings → API Keys
---
## 4. Configure MongoDB
Start your local MongoDB server or connect to MongoDB Atlas.
Populate the database with student profiles using a script or manually.
## Usage
Start the Backend Server
```bash
Copy code
cd server
node server.js
```
Start the Frontend Client
```bash
Copy code
cd ../client
npm start
```
Open your browser at: http://localhost:3000
---
## How to Use
-View Students: Browse student profiles and their funding needs.

-Make a Payment: Input the amount and click "Pay Now" to complete a Razorpay transaction.

-Track Funding: "Received" and "Remaining" fields update automatically after payment confirmation.

-Automatic Updates: Backend verifies payment and updates MongoDB.

## Contact
Name: D.Tejaswi
Email: tejaswi_darsi@srmap.edu.in
GitHub: https://github.com/Tejaswidarsi
