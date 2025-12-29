# DailyMindflow

A premium full-stack blogging platform built with NOde.js, Express, MongoDB, and EJS.

## Features
- **Public**: Home, Blog Listing, Single Post, Category Filter, Search, About, Contact, Dark/Light Mode.
- **Admin**: Dashboard, Create/Edit/Delete Posts, Image Support, Secure Login/Register.
- **Tech Stack**: Node.js, Express, MongoDB (Mongoose), EJS, JWT Authentication.

## Installation

1.  **Clone/Download** the repository.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    - **Start Database**: Run `.\start_db.ps1` in a separate PowerShell window to start MongoDB.
    - `.env` file is already configured.
4.  **Seed Data** (Optional but recommended):
    ```bash
    node seed.js
    ```
    - Creates Admin User: `admin` / `password123`
    - Creates Sample Categories and Posts.

## Usage

1.  **Start Server**:
    Navigate to the project folder first:
    ```bash
    cd daily-mindflow
    npm start
    ```
    OR for development:
    ```bash
    npm run dev
    ```
2.  **Access App**:
    - Public Site: `http://localhost:5000`
    - Admin Panel: `http://localhost:5000/admin/dashboard` (Login required)

## Project Structure
- `server.js`: Entry point.
- `models/`: Database schemas.
- `routes/`: Express routes.
- `views/`: EJS templates.
- `public/`: Static assets (CSS, JS).
