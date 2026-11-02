TaskFlow is a full-stack mobile task management application built with React Native and Node.js. It helps users organise their daily activities, manage deadlines, track task progress, and prioritise work through a simple mobile interface.

Features
- User Authentication – Register and log in securely using email and password.
- Task Management – Create, view, complete, and delete tasks.
- Task Details – Add descriptions, scheduled dates, deadlines, priorities, and categories.
- Priority Management – Organise tasks by Low, Medium, and High priority.
- Category Filtering – Filter tasks by Work, Personal, Study, and Other.
- Search and Sorting – Search tasks and sort them by deadline, priority, or smart urgency.
- Progress Overview – Track pending, completed, and overdue tasks.
- Push Notifications – Receive notifications when a new task is added.
- Session Persistence – Stay logged in across app restarts.

Tech Stack
Mobile Application
- React Native
- TypeScript
- Redux Toolkit
- React Navigation
- Axios
- AsyncStorage
- Notifee

Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

Getting Started
Prerequisites
- Node.js (v22.11.0 or later)
- npm
- MongoDB or MongoDB Atlas
- Android Studio and Android SDK (for Android development)
- Xcode (for iOS development on macOS)

1. Clone the repository
git clone https://github.com/aamalrxj/Todo-App.git
cd Todo-App

2. Configure and start the backend
cd backend
npm install

Create a `.env` file inside the `backend` folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the backend development server:
npm run dev

3. Configure and start the mobile application
Open a new terminal:
cd Todo-App/TodoApp
npm install

Start the Metro development server:
npm start

4. Run the application

For Android:
npm run android

For iOS:
npm run ios

Make sure the backend is running and the API URL in `TodoApp/src/api/client.ts` points to your backend.

Authentication & Data Storage
- Passwords are hashed using bcrypt before being stored.
- JWT tokens are used to authenticate API requests.
- AsyncStorage keeps the user's session on the device.
- MongoDB stores user accounts and task information.
- Task endpoints are protected so users can access only their own tasks.

Future Improvements
- Task editing from the mobile interface.
- Scheduled deadline reminders.
- Recurring tasks and calendar integration.
- Additional task analytics.
