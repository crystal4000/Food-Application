# React Authentication App

A modern React application built with TypeScript, featuring user authentication, responsive design, and a clean UI.

## 🚀 Features

- User Authentication (Login/Signup)
- Responsive Navigation
- Toast Notifications
- Protected Routes
- Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- React 19.0.0
- TypeScript
- Firebase Authentication
- React Router DOM v7
- React Hook Form
- Zod (Form Validation)
- Tailwind CSS
- Vite (Build Tool)
- Sonner (Toast Notifications)

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-react-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Preview the production build locally

## 🏗️ Project Structure

```
├── node_modules/          # Node modules
├── api/                   # API related files
├── public/                # Public assets
├──src/                    # Source code
    ├── assets/                # Static assets
    ├── components/            # Reusable components
    ├── css/                   # Global styles
    ├── pages/                 # App pages
    ├── App.css                # Global styles
    ├── App.tsx                # Main app component
    ├── main.tsx               # Entry point
    ├── index.css              # Global styles
    ├── firebase.ts            # Firebase configuration
    ├── vite-env.d.ts          # Vite environment variables
    ├── schema.ts              # Zod form validation schema
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Project dependencies
├── package-lock.json      # Project dependencies lock file
└── postcss.config.js      # PostCSS configuration
├── README.md              # Project documentation             # API related files
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.app.json      # TypeScript configuration for app
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript configuration for node
├── vite.config.ts         # Vite configuration
```

## 🎨 Features & Implementation

### Authentication

- Email/Password authentication using Firebase
- Protected routes for authenticated users
- User session management
- Logout functionality

### UI/UX

- Responsive navigation with hamburger menu
- Form validation using Zod
- Toast notifications for user feedback
- Custom styling with Tailwind CSS
- Smooth animations and transitions

## 🔒 Environment Variables

The following environment variables are required:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
