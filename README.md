# Attxenz: A Smart Attendance Tracker & Predictor

🚀 Live Demo Link : https://attendance-tracker-b9190.web.app

Attxenz is a modern, user-friendly web application designed to help students, particularly in India, effortlessly track, manage, and predict their class attendance. Gone are the days of manual calculations and uncertainty. With Attxenz, you can easily stay on top of your attendance requirements and make informed decisions about your schedule.

The application is built with a clean, responsive interface featuring both light and dark modes, and securely stores all your data online using Google's Firebase, accessible via a simple Google login.

---
## ✨ Core Features

* **Simplified Attendance Tracking:** No need to mark every single class. Simply provide the total number of classes conducted and attended so far, and the app handles all calculations.
* **Advanced Predictive Analysis:** The app's key feature is a powerful calculator that lets you see how your attendance will be affected by future absences. You can select any future date and enter the number of *whole days* or *individual classes* you plan to skip to get a precise, real-time prediction.
* **Intelligent & Flexible Holiday Calendar:** The app is designed for the Indian academic calendar. It automatically considers the following as holidays:
    * All Sundays.
    * A built-in list of major Indian public holidays (e.g., Republic Day, Diwali, Independence Day).
    * **Customizable Saturdays:** You can select which Saturdays of the month (1st, 2nd, 3rd, or 4th) are holidays at your specific institution.
    * The ability to add your own custom holidays for any other event.
* **"Week at a Glance" Dashboard:** The main dashboard provides a visual overview of your class schedule for the next 7 days, so you always know what's coming up.
* **Secure Cloud Storage:** All your data is securely saved to your personal account using Firebase Firestore. Log in from any device and your data is always there.
* **Easy Timetable Management:** You can add your class schedule manually or, for a more mobile-friendly experience, simply paste your timetable text (in JSON format) directly into a text box.
* **Google Authentication:** Secure and easy login using your existing Google account via OAuth 2.0.

---
## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend & Database:** Firebase (Firestore)
* **Authentication:** Firebase Authentication (Google OAuth)
* **Styling:** Tailwind CSS

---
<details>
  <summary>Getting Started with Create React App (Original Docs)</summary>

  This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

  ## Available Scripts

  In the project directory, you can run:

  ### `npm start`

  Runs the app in the development mode.\
  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

  The page will reload when you make changes.\
  You may also see any lint errors in the console.

  ### `npm test`

  Launches the test runner in the interactive watch mode.\
  See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

  ### `npm run build`

  Builds the app for production to the `build` folder.\
  It correctly bundles React in production mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes.\
  Your app is ready to be deployed!

  See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

</details>
