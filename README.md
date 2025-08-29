# Attxenz: A Smart Attendance Tracker & Predictor

### 🚀 [Live Demo Link](https://attendance-tracker-b9190.web.app/) 🚀

Attxenz is a modern, user-friendly web application designed to help students, particularly in India, effortlessly track, manage, and predict their class attendance. Gone are the days of manual calculations and uncertainty. With Attxenz, you can easily stay on top of your attendance requirements and make informed decisions about your schedule.

The application is built with a clean, responsive interface featuring both light and dark modes, and securely stores all your data online using Google's Firebase, accessible via a simple Google login.

---

## 🔄 Updates & New Features (Version 2.0)

This version represents a major overhaul of the application, focusing on a more professional structure, enhanced user experience, and powerful new features.

* **Complete UI & UX Overhaul:**
    * The single "Settings" page has been broken down into a more intuitive, multi-page layout with a dedicated sidebar for each function (`Dashboard`, `My Timetable`, `Cumulative Log`, `Subject Log`, etc.).
    * The app is now **fully responsive**, with a collapsible "hamburger" menu and an adaptive timetable layout for a seamless experience on mobile devices.

* **Dual Attendance Tracking Systems:**
    * Users can now choose between two independent tracking methods:
        1.  **Cumulative Tracking:** For a simple, high-level overview.
        2.  **Subject-Wise Tracking:** For detailed, per-subject analysis.

* **Fully Interactive Timetable:**
    * The "My Timetable" page now features a beautiful, **Excel-style grid**. Users can click any cell to add or delete classes directly.
    * **Export Functionality:** You can now export your created timetable as a JSON file.

* **Enhanced Goal Tracking & Prediction:**
    * The app now calculates the exact **number of classes needed to reach your goal**, providing clear, actionable feedback.
    * The "Subject Attendance" page includes its own dedicated prediction calculator.

---

## ✨ Core Features

* **Simplified Attendance Tracking:** Provides options for both simple cumulative tracking and detailed subject-wise tracking.
* **Advanced Predictive Analysis:** Powerful calculators let you see how your attendance will be affected by future absences, for both overall and subject-specific attendance.
* **Intelligent & Flexible Holiday Calendar:** Automatically considers Sundays and major Indian public holidays, while allowing for customizable Saturday rules and the ability to add a range of holidays (e.g., for a vacation) at once.
* **"Today's Classes" Card:** The main dashboard provides a visual overview of your classes for the current day.
* **Secure Cloud Storage:** All your data is securely saved to your personal account using Firebase Firestore.
* **Google Authentication:** Secure and easy login using your existing Google account.

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

  ### Available Scripts

  In the project directory, you can run:

  #### `npm start`

  Runs the app in the development mode.\
  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

  #### `npm run build`

  Builds the app for production to the `build` folder.

</details>