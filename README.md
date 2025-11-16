# JWT Authentication App with React + NestJS

A complete authentication system built with React frontend and NestJS backend, implementing secure JWT-based authentication with access and refresh tokens.

## 🚀 Features

- **JWT Authentication**: Secure login with access and refresh tokens
- **Automatic Token Refresh**: Seamless token renewal using Axios interceptors
- **Protected Routes**: Route-level authentication guards
- **React Hook Form**: Form validation and handling
- **React Query**: Server state management and caching
- **Modern UI**: Dark theme with React-inspired blue colors
- **TypeScript**: Full type safety across frontend and backend

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **TanStack React Query** - Server state management
- **React Hook Form** - Form handling and validation

### Backend

- **NestJS** - Node.js framework
- **JWT** - JSON Web Tokens
- **Passport** - Authentication middleware
- **bcryptjs** - Password hashing
- **class-validator** - Input validation

## 📦 Installation & Setup

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm

### Backend Setup

```bash
cd backend
pnpm install
pnpm start:dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Demo Credentials

- **Email**: admin@example.com
- **Password**: 123456

Alternative:

- **Email**: user@example.com
- **Password**: 123456

## 🏗️ Architecture

### Authentication Flow

1. **Login**: User submits credentials via React Hook Form
2. **Token Generation**: Backend generates access token (15min) and refresh token (7 days)
3. **Token Storage**: Access token stored in memory, refresh token in localStorage
4. **Auto Refresh**: Axios interceptor automatically refreshes expired access tokens
5. **Logout**: Clears all tokens and redirects to login

### Security Features

- Access tokens stored in memory (not persistent)
- Refresh tokens stored in localStorage
- Automatic token refresh on 401 responses
- Protected routes with authentication guards
- CORS enabled for development

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── interfaces/
│   │   │   └── strategies/
│   │   └── main.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
```

## 🎨 UI Features

- **Dark Theme**: Consistent dark color scheme
- **React Blue**: Primary color inspired by React branding
- **Responsive Design**: Mobile-friendly layout
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile (protected)

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
pnpm build
```

Deploy the `dist` folder to your hosting platform.

### Backend (Railway/Heroku)

```bash
cd backend
pnpm build
```

Set environment variables:

- `JWT_SECRET`: Your JWT secret key
- `PORT`: Server port (default: 3001)

## 🧪 Testing Authentication Flow

1. Navigate to `http://localhost:5173`
2. Try accessing dashboard (should redirect to login)
3. Login with demo credentials
4. Observe automatic token refresh in Network tab
5. Test logout functionality

## 🛡️ Security Considerations

- Tokens are properly scoped and time-limited
- Refresh token rotation could be implemented
- HTTPS should be used in production
- Consider implementing rate limiting
- Add CSRF protection for production

## 📝 Development

### Available Scripts

**Backend:**

- `pnpm start:dev` - Development mode with hot reload
- `pnpm build` - Build for production
- `pnpm test` - Run tests

**Frontend:**

- `pnpm dev` - Development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## 🎯 Assignment Requirements Fulfilled

✅ **Authentication Flow**: Complete login/logout with JWT tokens  
✅ **Token Management**: Access tokens in memory, refresh tokens in localStorage  
✅ **Axios Configuration**: Request/response interceptors with auto-refresh  
✅ **React Query Integration**: Mutations and queries for auth state  
✅ **React Hook Form**: Form validation and error handling  
✅ **Protected Routes**: Authentication guards and redirects  
✅ **Error Handling**: Comprehensive error management  
✅ **Public Hosting**: Ready for deployment to Vercel/Netlify

## 👨‍💻 Author

Created for CSC13114 - Advanced Web Development  
Student ID: 22127180

---

**Live Demo:** [Coming Soon - Will be deployed to Vercel]

For questions or issues, please check the console for detailed error messages and ensure both backend and frontend servers are running.
