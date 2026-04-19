# Lithala LMS — Complete Setup Guide

## 🚀 Get Live in 4 Steps

---

## STEP 1: Create Your Google Sheet

1. Go to **sheets.google.com** → Create new spreadsheet
2. Name it: `Lithala LMS Data`
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**YOUR_SHEET_ID_HERE**/edit`
4. The Apps Script will auto-create these tabs on first use:
   - `Users` — all registered learners
   - `Purchases` — course purchases
   - `Progress` — module completion tracking
   - `Results` — assessment scores
   - `DeletionRequests` — POPIA data deletion requests

---

## STEP 2: Deploy the Google Apps Script

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. Delete the default code
4. Copy and paste the entire contents of `google-apps-script.js`
5. On **line 3**, replace `YOUR_GOOGLE_SHEET_ID` with your Sheet ID from Step 1
6. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** → Copy the **Web App URL**
   - It looks like: `https://script.google.com/macros/s/XXXXX/exec`

---

## STEP 3: Update lms-config.js

Open `lms-config.js` and update these 3 lines at the top:

```javascript
SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
SHEET_ID:   'YOUR_GOOGLE_SHEET_ID',
SITE_URL:   'https://YOUR-GITHUB-USERNAME.github.io/lithala-lms',
```

---

## STEP 4: Upload to GitHub Pages

1. Create a new GitHub repository named `lithala-lms`
2. Upload ALL files:
   - `index.html`
   - `index3.html` (Course Catalogue)
   - `index4.html` (Templates & Docs)
   - `index5.html` (WhatsApp Learning)
   - `index6.html` (About & Contact)
   - `dashboard3.html` (Learner Dashboard)
   - `lms-config.js` (Course & config data)
   - `google-apps-script.js` (Reference only)
   - `shared.css`
   - `logo.png` (Add your Lithala logo)
3. Go to **Settings → Pages**
4. Source: **Deploy from a branch → main → / (root)**
5. Your site is live at: `https://YOUR-USERNAME.github.io/lithala-lms`

---

## 📧 Email Notifications

Every time a learner:
- **Registers** → Welcome email to learner, notification to admins
- **Completes an assessment** → Results emailed to learner + `info@lithala.com` + `lithala-lms@gmail.com`
- **Requests data deletion** → Alert emailed to admins

Admin emails are set in `google-apps-script.js` line 4:
```javascript
const ADMIN_EMAILS = ['info@lithala.com', 'lithala-lms@gmail.com'];
```

---

## 💬 WhatsApp Integration (Phase 2)

For real WhatsApp delivery (not the in-browser demo):

1. Apply for **WhatsApp Business API** at [business.whatsapp.com](https://business.whatsapp.com)
   - OR use **Twilio** (faster approval): [twilio.com/whatsapp](https://twilio.com/whatsapp)
2. Get your WhatsApp Business number
3. Build flows using **Twilio Studio** or **360dialog**
4. Connect to the Apps Script webhook endpoint
5. Update `WHATSAPP_NUMBER` in `lms-config.js`

**Estimated cost:** R2,000–5,000/month for Twilio WhatsApp API
**Setup time:** 2–4 weeks (Meta approval can take time)

---

## 🔐 Google OAuth (Gmail Login)

The current login uses localStorage (demo). For real Google OAuth:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project: `Lithala LMS`
3. Enable **Google Identity Services API**
4. Create **OAuth 2.0 credentials** (Web application)
5. Add your GitHub Pages URL to **Authorized JavaScript origins**
6. Copy your **Client ID**
7. Replace the `googleSignIn()` function in `dashboard3.html` with:

```javascript
function googleSignIn() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    callback: handleGoogleResponse
  });
  google.accounts.id.prompt();
}
function handleGoogleResponse(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const user = {
    email: payload.email,
    name: payload.name,
    photo: payload.picture,
    googleId: payload.sub,
    loginMethod: 'google'
  };
  localStorage.setItem('lms_user', JSON.stringify(user));
  // Save to Google Sheet
  fetch(LMS.SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'registerUser', ...user })
  });
  window.location.href = 'dashboard3.html';
}
```

Add to `<head>`:
```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

---

## 💳 Payment Integration (PayFast)

For real course purchases:

1. Register at [payfast.co.za](https://payfast.co.za)
2. Get your **Merchant ID** and **Merchant Key**
3. Add to `lms-config.js`:
```javascript
PAYFAST_MERCHANT_ID: 'YOUR_MERCHANT_ID',
PAYFAST_MERCHANT_KEY: 'YOUR_MERCHANT_KEY',
```
4. Replace the `purchaseCourse()` function to submit to PayFast's sandbox first
5. PayFast ITN (notification URL) = your Apps Script URL with `action: 'savePurchase'`

---

## 📊 Google Sheet Column Reference

### Users Sheet
| UserID | Email | Name | Photo | GoogleID | RegisteredAt | LastLogin | Status |

### Purchases Sheet
| PurchaseID | Email | CourseID | CourseName | Price | PaymentRef | PurchasedAt | Status | ExpiresAt |

### Results Sheet
| ResultID | Email | Name | CourseID | CourseName | Score | TotalQuestions | Percentage | Passed | SubmittedAt | Answers |

### Progress Sheet
| ProgressID | Email | CourseID | ModuleID | ModuleName | Score | Completed | StartedAt | UpdatedAt |

### DeletionRequests Sheet
| RequestID | Email | Name | Reason | RequestedAt | Status | ApprovedBy | ApprovedAt |

---

## 🔧 Adding/Editing Courses

All courses are defined in `lms-config.js` under `LMS.COURSES`. Each course has:
- `id` — unique identifier (e.g. `CS001`)
- `title`, `subtitle`, `category`, `price`
- `image` — Unsplash URL or your own hosted image
- `duration`, `modules`, `rating`, `enrolled`
- `badge` — `Bestseller`, `New`, `Popular`, `Essential`, or `elearning`
- `wa` — `true` if WhatsApp delivery is available
- `description`, `outcomes` — course overview
- `modules_list` — array of `{id, title, duration, isAssessment}`
- `questions` — array of `{q, options, answer}` for the assessment

---

## 🌐 Custom Domain (Optional)

To use `lms.lithala.com` instead of GitHub Pages URL:

1. In your domain registrar (Domains.co.za, etc.), add a CNAME record:
   - Host: `lms`
   - Points to: `YOUR-USERNAME.github.io`
2. In GitHub repo → Settings → Pages → Custom domain: `lms.lithala.com`
3. Enable **Enforce HTTPS**

---

## 📞 Support

- Email: info@lithala.com
- WhatsApp: +27 (0) 82 421 4001
- Website: lithala.com

