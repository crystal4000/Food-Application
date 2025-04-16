# Lilies Food Ordering App

A modern React food ordering application built with TypeScript, featuring user authentication, responsive design, and a clean UI for ordering food anytime, anywhere.

## 🚀 Features

- User Authentication (Login/Signup/Password Reset)
- Dashboard with Multiple Sections (Home, Favorites, Cart, Messages, Orders)
- Responsive Navigation with Mobile Support
- Real-time Toast Notifications
- Protected Routes
- Modern UI with Custom Tailwind Theme
- Search Functionality
- User Profile Management

## 🛠️ Tech Stack

- React 19.0.0
- TypeScript
- Firebase Authentication
- React Router DOM v7
- React Hook Form with Zod Validation
- Tailwind CSS
- Vite
- Sonner (Toast Notifications)
- React Icons

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
- `npm run build` - Builds the app for production (runs TypeScript build first)
- `npm run lint` - Runs ESLint
- `npm run preview` - Preview the production build locally

## 🏗️ Project Structure

```
src/
├── assets/                # Static assets including landing page images
├── components/
│   ├── Dashboard/        # Dashboard-specific components
│   ├── Home/            # Landing page components
│   └── Card.tsx         # Reusable card component
├── css/                  # Global styles
├── hooks/               # Custom hooks (useAuth, etc.)
├── pages/               # Main application pages
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NewPassword.tsx
│   ├── ResetPassword.tsx
│   └── Signup.tsx
├── utils/               # Utility functions and Firebase config
├── App.tsx             # Main app component with routes
└── main.tsx            # Application entry point
```

## 🎨 Features & Implementation

### Authentication

- Email/Password authentication using Firebase
- Password reset functionality
- Protected dashboard routes
- User session management
- Profile picture support

### Dashboard Features

- Sidebar navigation with multiple sections
- Search functionality for meals and restaurants
- Notification system
- User profile management
- Order management system

### UI/UX

- Custom color scheme with Tailwind
- Responsive design for all screen sizes
- Mobile-first approach
- Toast notifications for user feedback
- Smooth transitions and animations
- Mobile app download options (Google Play & App Store)

### Landing Page

- Hero section with app promotion
- Special meals showcase
- Newsletter subscription
- Footer with multiple sections
- Social media integration

## 🎯 Custom Theme Colors

The application uses a custom color palette defined in Tailwind:

- Primary Background: #00302e
- Custom Orange: #f5c994
- Footer Background: #0b0d17
- Various white opacity variants
- Custom border colors

## 🔒 Environment Variables

Required Firebase configuration variables:

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
