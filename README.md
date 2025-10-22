# 💾 TNGSS Contact Manager v1.0 💾

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/) [![Tesseract.js](https://img.shields.io/badge/Tesseract.js-FF0000?style=for-the-badge&logo=javascript&logoColor=white)](https://tesseract.projectnaptha.com/)

---

## // 🚀 OVERVIEW

`Initializing TNGSS Contact Manager...`
This is a streamlined, 8-bit arcade-themed dashboard built to digitize and manage contacts acquired from events like TNGSS. Say goodbye to manual entry drudgery and hello to efficient contact management! Features OCR scanning, direct emailing, user-specific contact lists, and tagging.



---

## // 💻 TECH STACK

* **Frontend:** React.js (`create-react-app`)
* **Styling:** CSS (8-bit arcade theme)
* **Database:** Firestore (User-specific subcollections)
* **Authentication:** Firebase Authentication (Google Sign-In)
* **Backend (Email):** Vercel Serverless Functions
* **Email Service:** Resend API
* **OCR:** Tesseract.js (In-browser)
* **Deployment:** Vercel

---

## // ✨ FEATURES

* **🔐 Secure User Authentication:** Log in via Google to access your private contact list.
* **📇 Add Contacts Manually:** Standard form entry for contact details.
* **📸 OCR Business Card Scanner:** Toggle scan mode, upload a card image, review & edit auto-filled data (Name, Company/Industry, Email, Phone), and save. Powered by Tesseract.js running locally in your browser!
* **🔍 Search & Filter:** Dynamic client-side search (Name, Company, Notes, Tags) and filtering by Industry or Tag.
* **🏷️ Tagging System:** Add comma-separated tags to contacts for custom organization.
* **👁️ View Details:** Click any contact card to open a modal with full info.
* **✏️ Edit & Delete:** Modify or remove contacts securely via the view modal.
* **📧 Direct Emailing:** Send emails directly to contacts from the app (uses Resend API via Vercel function, `reply-to` set to your logged-in email).
* **💾 Export Data:** Export *your* entire contact list to an `.xlsx` file.
* **👾 Retro UI:** Cool 8-bit arcade aesthetic.

---

## // 🎥 DEMO

*(Suggestion: Record a short GIF showing the OCR scanning and email sending features!)*

`[Link to GIF or add screenshot images here]`

---

## // ⚙️ LOCAL SETUP

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tngss-contact-manager.git](https://github.com/your-username/tngss-contact-manager.git)
    cd tngss-contact-manager/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Firebase Setup:**
    * Create a Firebase project.
    * Enable Firestore and Authentication (Google Sign-In).
    * Get your Firebase config object and paste it into `frontend/src/firebase.js`.
    * Set up Firestore security rules for user-specific data (see code).
4.  **Resend Setup:**
    * Sign up for Resend.
    * Verify your domain/email.
    * Get your API key.
5.  **Local Environment Variables:**
    * Create a `frontend/.env.local` file.
    * Add your Resend API key:
        ```ini
        RESEND_API_KEY=your_resend_api_key_here
        ```
6.  **Run locally using Vercel CLI:**
    ```bash
    vercel dev
    ```
    *(This runs both the React app and the API function)*

---

## // 🌐 DEPLOYMENT

Live instance deployed on Vercel:
`[Link to your production Vercel URL: e.g., https://tngss-contact-manager.vercel.app]`

*(Remember to set `RESEND_API_KEY` as an environment variable in your Vercel project settings!)*

---

## // 🔮 FUTURE ENHANCEMENTS

* Analytics Dashboard (Charts for Industry/Year breakdown).
* Attach scanned card images (using Firebase Storage).
* Bulk actions (Delete, Mark Follow-up).

---

`Process finished.`
