// ============================================================
// LITHALA LMS — Google Apps Script Backend
// Deploy as Web App: Execute as Me, Anyone can access
// ============================================================

const SHEET_ID = '110-K93UME8_8z5pystKKc5yIsoAC1_OdKyt4KSs0oco/edit?usp=drivesdk'; // Replace after creating sheet
const ADMIN_EMAILS = ['info@lithala.com', 'lithalalms@gmail.com'];

const SHEET_NAMES = {
  USERS:    'Users',
  PURCHASES:'Purchases',
  PROGRESS: 'Progress',
  RESULTS:  'Results',
  DELETIONS:'DeletionRequests'
};

// ── MAIN ROUTER ──────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    let result;

    switch(action) {
      case 'registerUser':    result = registerUser(data);     break;
      case 'getUser':         result = getUser(data);          break;
      case 'savePurchase':    result = savePurchase(data);     break;
      case 'getPurchases':    result = getPurchases(data);     break;
      case 'saveProgress':    result = saveProgress(data);     break;
      case 'getProgress':     result = getProgress(data);      break;
      case 'submitResult':    result = submitResult(data);     break;
      case 'getResults':      result = getResults(data);       break;
      case 'requestDeletion': result = requestDeletion(data);  break;
      default: result = { success: false, error: 'Unknown action' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Allow GET for simpler calls
  return doPost({ postData: { contents: JSON.stringify(e.parameter) } });
}

// ── CORS HELPER ──────────────────────────────────────────────
function setCORSHeaders(output) {
  return output; // GAS handles CORS for web app deployments
}

// ── USER REGISTRATION / LOOKUP ───────────────────────────────
function registerUser(data) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const { email, name, photo, googleId } = data;

  // Check if exists
  const existing = findRow(sheet, 'Email', email);
  if (existing) {
    // Update last login
    const row = existing.row;
    sheet.getRange(row, getColIndex(sheet, 'LastLogin')).setValue(new Date().toISOString());
    return { success: true, user: rowToObject(sheet, row), isNew: false };
  }

  // Create new user
  const userId = 'USR-' + Date.now();
  const timestamp = new Date().toISOString();
  appendRow(sheet, {
    UserID: userId,
    Email: email,
    Name: name,
    Photo: photo || '',
    GoogleID: googleId || '',
    RegisteredAt: timestamp,
    LastLogin: timestamp,
    Status: 'active'
  });

  // Send welcome email
  sendWelcomeEmail(email, name);

  return { success: true, user: { userId, email, name, photo }, isNew: true };
}

function getUser(data) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const existing = findRow(sheet, 'Email', data.email);
  if (!existing) return { success: false, error: 'User not found' };
  return { success: true, user: rowToObject(sheet, existing.row) };
}

// ── PURCHASES ────────────────────────────────────────────────
function savePurchase(data) {
  const sheet = getSheet(SHEET_NAMES.PURCHASES);
  const { email, courseId, courseName, price, paymentRef } = data;

  const purchaseId = 'PUR-' + Date.now();
  appendRow(sheet, {
    PurchaseID: purchaseId,
    Email: email,
    CourseID: courseId,
    CourseName: courseName,
    Price: price,
    PaymentRef: paymentRef || 'DEMO',
    PurchasedAt: new Date().toISOString(),
    Status: 'active',
    ExpiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString() // 1 year
  });

  // Notify admins
  notifyAdmins('New Purchase', `${email} purchased ${courseName} for ${price}`);

  return { success: true, purchaseId };
}

function getPurchases(data) {
  const sheet = getSheet(SHEET_NAMES.PURCHASES);
  const rows = findAllRows(sheet, 'Email', data.email);
  return { success: true, purchases: rows.map(r => rowToObject(sheet, r)) };
}

// ── PROGRESS TRACKING ────────────────────────────────────────
function saveProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const { email, courseId, moduleId, moduleName, score, completed } = data;

  // Check if progress record exists for this module
  const existing = findRowMulti(sheet, { Email: email, CourseID: courseId, ModuleID: moduleId });

  if (existing) {
    sheet.getRange(existing.row, getColIndex(sheet, 'Score')).setValue(score || 0);
    sheet.getRange(existing.row, getColIndex(sheet, 'Completed')).setValue(completed ? 'Yes' : 'No');
    sheet.getRange(existing.row, getColIndex(sheet, 'UpdatedAt')).setValue(new Date().toISOString());
  } else {
    appendRow(sheet, {
      ProgressID: 'PRG-' + Date.now(),
      Email: email,
      CourseID: courseId,
      ModuleID: moduleId,
      ModuleName: moduleName,
      Score: score || 0,
      Completed: completed ? 'Yes' : 'No',
      StartedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    });
  }

  return { success: true };
}

function getProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const rows = findAllRowsMulti(sheet, { Email: data.email, CourseID: data.courseId });
  return { success: true, progress: rows.map(r => rowToObject(sheet, r)) };
}

// ── ASSESSMENT RESULTS ───────────────────────────────────────
function submitResult(data) {
  const sheet = getSheet(SHEET_NAMES.RESULTS);
  const { email, name, courseId, courseName, score, totalQuestions, passed, answers } = data;

  const resultId = 'RES-' + Date.now();
  const timestamp = new Date().toISOString();

  appendRow(sheet, {
    ResultID: resultId,
    Email: email,
    Name: name,
    CourseID: courseId,
    CourseName: courseName,
    Score: score,
    TotalQuestions: totalQuestions,
    Percentage: Math.round((score/totalQuestions)*100) + '%',
    Passed: passed ? 'Yes' : 'No',
    SubmittedAt: timestamp,
    Answers: JSON.stringify(answers || {})
  });

  // Email result to user and admins
  sendResultEmail(email, name, courseName, score, totalQuestions, passed);
  notifyAdmins('Assessment Result',
    `${name} (${email}) scored ${score}/${totalQuestions} on ${courseName}. ${passed ? 'PASSED ✅' : 'FAILED ❌'}`
  );

  return { success: true, resultId, passed };
}

function getResults(data) {
  const sheet = getSheet(SHEET_NAMES.RESULTS);
  const rows = findAllRows(sheet, 'Email', data.email);
  return { success: true, results: rows.map(r => rowToObject(sheet, r)) };
}

// ── DATA DELETION REQUEST ────────────────────────────────────
function requestDeletion(data) {
  const sheet = getSheet(SHEET_NAMES.DELETIONS);
  appendRow(sheet, {
    RequestID: 'DEL-' + Date.now(),
    Email: data.email,
    Name: data.name,
    Reason: data.reason || 'User request',
    RequestedAt: new Date().toISOString(),
    Status: 'Pending',
    ApprovedBy: '',
    ApprovedAt: ''
  });

  notifyAdmins('Data Deletion Request',
    `${data.name} (${data.email}) has requested deletion of their data. Please review in the Google Sheet.`
  );

  return { success: true, message: 'Deletion request submitted. You will be notified within 5 business days.' };
}

// ── EMAIL HELPERS ─────────────────────────────────────────────
function sendWelcomeEmail(email, name) {
  try {
    MailApp.sendEmail({
      to: email,
      subject: '🛡️ Welcome to Lithala LMS',
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1a3a2a;padding:30px;text-align:center">
            <h1 style="color:#52b788;margin:0;font-size:28px">LITHALA LMS</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Risk Solutions</p>
          </div>
          <div style="padding:32px;background:#f8f4ec">
            <h2 style="color:#1a3a2a">Welcome, ${name}! 🎓</h2>
            <p style="color:#555;line-height:1.7">Your Lithala LMS account has been created. You can now browse and purchase HSE courses, track your progress, and earn verified digital certificates.</p>
            <a href="https://YOUR-GITHUB-USERNAME.github.io/lithala-lms/dashboard3.html" style="display:inline-block;background:#1565c0;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">Go to My Dashboard →</a>
          </div>
          <div style="padding:20px;text-align:center;color:#aaa;font-size:12px">
            <p>© 2025 Lithala Risk Solutions (Pty) Ltd · <a href="https://lithala.com" style="color:#1565c0">lithala.com</a></p>
          </div>
        </div>
      `
    });
  } catch(e) { Logger.log('Welcome email failed: ' + e); }
}

function sendResultEmail(email, name, courseName, score, total, passed) {
  const pct = Math.round((score/total)*100);
  const status = passed ? '✅ PASSED' : '❌ Not Yet Competent';
  try {
    MailApp.sendEmail({
      to: email,
      bcc: ADMIN_EMAILS.join(','),
      subject: `${passed ? '🏆' : '📋'} Assessment Result — ${courseName}`,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:${passed ? '#1a3a2a' : '#0d2b52'};padding:30px;text-align:center">
            <h1 style="color:#52b788;margin:0">LITHALA LMS</h1>
          </div>
          <div style="padding:32px;background:#f8f4ec">
            <h2 style="color:#1a3a2a">Assessment Complete</h2>
            <p style="color:#555">Hi ${name},</p>
            <p style="color:#555;line-height:1.7">You have completed the assessment for <strong>${courseName}</strong>.</p>
            <div style="background:${passed ? '#e8f5e9' : '#fff3e0'};border-left:4px solid ${passed ? '#52b788' : '#f4a261'};padding:20px;border-radius:8px;margin:20px 0">
              <div style="font-size:32px;font-weight:bold;color:${passed ? '#2d6a4f' : '#e65100'}">${pct}%</div>
              <div style="font-size:18px;color:${passed ? '#2d6a4f' : '#e65100'};font-weight:bold">${status}</div>
              <div style="color:#555;margin-top:8px">${score} out of ${total} correct</div>
            </div>
            ${passed ? `<p style="color:#555">Your certificate will be emailed to you within 24 hours. You can also download it from your <a href="https://YOUR-GITHUB-USERNAME.github.io/lithala-lms/dashboard3.html" style="color:#1565c0">dashboard</a>.</p>` : `<p style="color:#555">You need 80% to pass. You can retake the assessment from your dashboard after reviewing the course material.</p>`}
          </div>
          <div style="padding:20px;text-align:center;color:#aaa;font-size:12px">
            <p>© 2025 Lithala Risk Solutions (Pty) Ltd</p>
          </div>
        </div>
      `
    });
  } catch(e) { Logger.log('Result email failed: ' + e); }
}

function notifyAdmins(subject, message) {
  try {
    ADMIN_EMAILS.forEach(email => {
      MailApp.sendEmail({
        to: email,
        subject: `[Lithala LMS] ${subject}`,
        body: `${message}\n\nTimestamp: ${new Date().toISOString()}\n\nView data: https://docs.google.com/spreadsheets/d/${SHEET_ID}`
      });
    });
  } catch(e) { Logger.log('Admin notify failed: ' + e); }
}

// ── SHEET UTILITIES ───────────────────────────────────────────
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    setupSheetHeaders(sheet, name);
  }
  return sheet;
}

function setupSheetHeaders(sheet, name) {
  const headers = {
    Users:    ['UserID','Email','Name','Photo','GoogleID','RegisteredAt','LastLogin','Status'],
    Purchases:['PurchaseID','Email','CourseID','CourseName','Price','PaymentRef','PurchasedAt','Status','ExpiresAt'],
    Progress: ['ProgressID','Email','CourseID','ModuleID','ModuleName','Score','Completed','StartedAt','UpdatedAt'],
    Results:  ['ResultID','Email','Name','CourseID','CourseName','Score','TotalQuestions','Percentage','Passed','SubmittedAt','Answers'],
    DeletionRequests:['RequestID','Email','Name','Reason','RequestedAt','Status','ApprovedBy','ApprovedAt']
  };
  if (headers[name]) {
    sheet.getRange(1, 1, 1, headers[name].length).setValues([headers[name]]);
    sheet.getRange(1, 1, 1, headers[name].length)
      .setBackground('#1a3a2a').setFontColor('#ffffff').setFontWeight('bold');
  }
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function getColIndex(sheet, colName) {
  const headers = getHeaders(sheet);
  return headers.indexOf(colName) + 1;
}

function appendRow(sheet, obj) {
  const headers = getHeaders(sheet);
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sheet.appendRow(row);
}

function findRow(sheet, colName, value) {
  const col = getColIndex(sheet, colName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col-1]).toLowerCase() === String(value).toLowerCase()) {
      return { row: i+1, data: data[i] };
    }
  }
  return null;
}

function findAllRows(sheet, colName, value) {
  const col = getColIndex(sheet, colName);
  const data = sheet.getDataRange().getValues();
  const results = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col-1]).toLowerCase() === String(value).toLowerCase()) {
      results.push(i+1);
    }
  }
  return results;
}

function findRowMulti(sheet, conditions) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    let match = true;
    for (const [col, val] of Object.entries(conditions)) {
      const colIdx = headers.indexOf(col);
      if (colIdx === -1 || String(data[i][colIdx]) !== String(val)) { match = false; break; }
    }
    if (match) return { row: i+1, data: data[i] };
  }
  return null;
}

function findAllRowsMulti(sheet, conditions) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];
  for (let i = 1; i < data.length; i++) {
    let match = true;
    for (const [col, val] of Object.entries(conditions)) {
      const colIdx = headers.indexOf(col);
      if (colIdx === -1 || String(data[i][colIdx]) !== String(val)) { match = false; break; }
    }
    if (match) results.push(i+1);
  }
  return results;
}

function rowToObject(sheet, rowNum) {
  const headers = getHeaders(sheet);
  const row = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);
  return obj;
}
