# EdConnect

EdConnect is a web-based student help desk system designed to streamline communication between students and college administration. It allows students to submit service requests (such as certificates or documents), track their status, and receive updates, while help desk staff can verify requests and process them efficiently through a single dashboard.

---

## 🚀 Features

### Student Side

* Submit certificate / service requests online
* Upload ID card or required proof for verification
* Track request status in real time
* Simple and clean user interface

### Admin / Help Desk Side

* View all incoming student requests
* Verify uploaded ID proofs
* Approve / reject / process requests
* Manage requests from a centralized dashboard

---

## 🛠 Tech Stack

### Frontend

* **React (Vite)**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI / Radix UI components**

### Backend

* **Supabase** (Database + Storage)
* **Authentication** (Email-based / Firebase-style auth)

### Tooling

* ESLint
* PostCSS
* Vite for fast builds

---

## 📁 Project Structure

```
Edconnect-main/
│
├── public/            # Static assets
├── src/               # Application source code
│   ├── components/    # Reusable UI components
│   ├── pages/         # App pages
│   ├── hooks/         # Custom hooks
│   └── lib/           # Utilities & helpers
│
├── supabase/           # Supabase config & helpers
├── index.html
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/edconnect.git
cd edconnect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root and add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the app

```bash
npm run dev
```

App will run at: `http://localhost:5173`

---

## 🔐 Authentication

* Students and admins authenticate securely
* Supabase handles session management
* Protected routes for admin dashboard

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 🎯 Use Case

This system is ideal for:

* Colleges & universities
* Training institutes
* Student service departments
* Internal help desk automation

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Gokul Prasanth**

If you find this project useful, consider giving it a ⭐ on GitHub.
