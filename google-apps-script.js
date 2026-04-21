// ============================================================
// LITHALA LMS — Google Apps Script Backend
// Deploy as Web App: Execute as Me, Anyone can access
// ============================================================

const SHEET_ID    = '110-K93UME8_8z5pystKKc5yIsoAC1_OdKyt4KSs0oco';
const ADMIN_EMAILS = ['info@lithala.com', 'lithalalms@gmail.com'];
const SITE_URL    = 'https://lithala-lms.github.io/LMS';

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
      case 'saveCourse':      result = saveCourse(data);       break;
      case 'deleteCourse':    result = deleteCourse(data);     break;
      case 'getSheetData':    result = getSheetData(data);     break;
      case 'getSheetCounts':  result = getSheetCounts();       break;
      case 'exportCSV':       result = exportCSV(data);        break;
      case 'approveDeletion': result = approveDeletion(data);  break;
      case 'payfastNotify':   result = payfastNotify(data);    break;
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
  return doPost({ postData: { contents: JSON.stringify(e.parameter) } });
}

// ── USER REGISTRATION / LOOKUP ───────────────────────────────
function registerUser(data) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const { email, name, photo, googleId } = data;

  const existing = findRow(sheet, 'Email', email);
  if (existing) {
    sheet.getRange(existing.row, getColIndex(sheet, 'LastLogin')).setValue(new Date().toISOString());
    return { success: true, user: rowToObject(sheet, existing.row), isNew: false };
  }

  const userId    = 'USR-' + Date.now();
  const timestamp = new Date().toISOString();
  appendRow(sheet, {
    UserID: userId, Email: email, Name: name,
    Photo: photo || '', GoogleID: googleId || '',
    RegisteredAt: timestamp, LastLogin: timestamp, Status: 'active'
  });

  sendWelcomeEmail(email, name);
  notifyAdmins('New Registration', `${name} (${email}) just registered on Lithala LMS.`);
  return { success: true, user: { userId, email, name, photo }, isNew: true };
}

function getUser(data) {
  const sheet    = getSheet(SHEET_NAMES.USERS);
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
    PurchaseID: purchaseId, Email: email,
    CourseID: courseId, CourseName: courseName, Price: price,
    PaymentRef: paymentRef || 'DEMO',
    PurchasedAt: new Date().toISOString(), Status: 'active',
    ExpiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString()
  });

  notifyAdmins('New Purchase', `${email} purchased "${courseName}" for ${price}`);
  return { success: true, purchaseId };
}

function getPurchases(data) {
  const sheet = getSheet(SHEET_NAMES.PURCHASES);
  const rows  = findAllRows(sheet, 'Email', data.email);
  return { success: true, purchases: rows.map(r => rowToObject(sheet, r)) };
}

// ── PROGRESS TRACKING ────────────────────────────────────────
function saveProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const { email, courseId, moduleId, moduleName, score, completed } = data;

  const existing = findRowMulti(sheet, { Email: email, CourseID: courseId, ModuleID: moduleId });
  if (existing) {
    sheet.getRange(existing.row, getColIndex(sheet, 'Score')).setValue(score || 0);
    sheet.getRange(existing.row, getColIndex(sheet, 'Completed')).setValue(completed ? 'Yes' : 'No');
    sheet.getRange(existing.row, getColIndex(sheet, 'UpdatedAt')).setValue(new Date().toISOString());
  } else {
    appendRow(sheet, {
      ProgressID: 'PRG-' + Date.now(), Email: email,
      CourseID: courseId, ModuleID: moduleId, ModuleName: moduleName,
      Score: score || 0, Completed: completed ? 'Yes' : 'No',
      StartedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString()
    });
  }
  return { success: true };
}

function getProgress(data) {
  const sheet = getSheet(SHEET_NAMES.PROGRESS);
  const rows  = findAllRowsMulti(sheet, { Email: data.email, CourseID: data.courseId });
  return { success: true, progress: rows.map(r => rowToObject(sheet, r)) };
}

// ── ASSESSMENT RESULTS ───────────────────────────────────────
function submitResult(data) {
  const sheet = getSheet(SHEET_NAMES.RESULTS);
  const { email, name, courseId, courseName, score, totalQuestions, passed, answers } = data;

  const resultId  = 'RES-' + Date.now();
  const timestamp = new Date().toISOString();
  const certNum   = passed ? 'LTH-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*9000+1000) : null;

  appendRow(sheet, {
    ResultID: resultId, Email: email, Name: name,
    CourseID: courseId, CourseName: courseName,
    Score: score, TotalQuestions: totalQuestions,
    Percentage: Math.round((score/totalQuestions)*100) + '%',
    Passed: passed ? 'Yes' : 'No',
    CertificateNo: certNum || '',
    SubmittedAt: timestamp,
    Answers: JSON.stringify(answers || {})
  });

  // Email learner their result
  sendResultEmail(email, name, courseName, score, totalQuestions, passed, certNum);

  // Email EACH admin separately with full details
  sendAdminResultAlert(email, name, courseName, score, totalQuestions, passed, certNum);

  return { success: true, resultId, passed, certNum };
}

function getResults(data) {
  const sheet = getSheet(SHEET_NAMES.RESULTS);
  const rows  = findAllRows(sheet, 'Email', data.email);
  return { success: true, results: rows.map(r => rowToObject(sheet, r)) };
}

// ── DATA DELETION REQUEST ────────────────────────────────────
function requestDeletion(data) {
  const sheet = getSheet(SHEET_NAMES.DELETIONS);
  appendRow(sheet, {
    RequestID: 'DEL-' + Date.now(),
    Email: data.email, Name: data.name,
    Reason: data.reason || 'User request',
    RequestedAt: new Date().toISOString(),
    Status: 'Pending', ApprovedBy: '', ApprovedAt: ''
  });
  notifyAdmins('⚠ Data Deletion Request (POPIA)',
    `${data.name} (${data.email}) has requested deletion of their personal data.\n\nPlease review and approve in the Google Sheet within 5 business days.\n\nSheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}`
  );
  return { success: true, message: 'Deletion request submitted. You will be notified within 5 business days.' };
}

// ── COURSE MANAGEMENT (Admin) ─────────────────────────────────
function saveCourse(data) {
  const sheet = getSheet('Courses');
  if (sheet.getLastRow() === 1 || sheet.getLastRow() === 0) {
    const h = ['CourseID','Title','Subtitle','Category','Price','Duration','Modules','Badge','WA','Description','Outcomes','Image','Active','UpdatedAt'];
    sheet.getRange(1,1,1,h.length).setValues([h]).setBackground('#1a3a2a').setFontColor('#fff').setFontWeight('bold');
  }
  const c   = data.course;
  const existing = findRow(sheet, 'CourseID', c.id);
  const row = [c.id,c.title,c.subtitle||'',c.category||'',c.price||0,c.duration||'',c.modules||0,c.badge||'',c.wa?'Yes':'No',c.description||'',(c.outcomes||[]).join(' | '),c.image||'','Yes',new Date().toISOString()];
  if (existing) { sheet.getRange(existing.row,1,1,row.length).setValues([row]); }
  else { sheet.appendRow(row); }
  return { success: true };
}

function deleteCourse(data) {
  const sheet = getSheet('Courses');
  const existing = findRow(sheet, 'CourseID', data.courseId);
  if (existing) { sheet.getRange(existing.row, getColIndex(sheet,'Active')).setValue('Deleted'); }
  return { success: true };
}

function getSheetData(data) {
  const sheet = getSheet(data.sheetName);
  if (sheet.getLastRow() <= 1) return { success: true, rows: [], headers: [] };
  const all     = sheet.getDataRange().getValues();
  const headers = all[0];
  const rows    = all.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
  return { success: true, headers, rows };
}

function getSheetCounts() {
  try {
    const users     = Math.max(0, getSheet(SHEET_NAMES.USERS).getLastRow()     - 1);
    const purchases = Math.max(0, getSheet(SHEET_NAMES.PURCHASES).getLastRow() - 1);
    const rSheet    = getSheet(SHEET_NAMES.RESULTS);
    const allR      = rSheet.getLastRow() > 1 ? rSheet.getDataRange().getValues().slice(1) : [];
    const passCol   = getColIndex(rSheet,'Passed') - 1;
    const passes    = allR.filter(r => r[passCol] === 'Yes').length;
    return { success: true, counts: { users, purchases, passes } };
  } catch(e) { return { success: false, error: e.toString() }; }
}

function exportCSV(data) {
  const sheet = getSheet(data.sheetName);
  const all   = sheet.getDataRange().getValues();
  const csv   = all.map(row => row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  return { success: true, csv };
}

function approveDeletion(data) {
  // Mark request approved
  const delSheet = getSheet(SHEET_NAMES.DELETIONS);
  const req = findRow(delSheet, 'RequestID', data.requestId || '') || findRow(delSheet, 'Email', data.email || '');
  if (req) {
    delSheet.getRange(req.row, getColIndex(delSheet,'Status')).setValue('Approved');
    delSheet.getRange(req.row, getColIndex(delSheet,'ApprovedAt')).setValue(new Date().toISOString());
  }
  // Delete from all data sheets
  [SHEET_NAMES.USERS, SHEET_NAMES.PURCHASES, SHEET_NAMES.PROGRESS, SHEET_NAMES.RESULTS].forEach(sName => {
    const s       = getSheet(sName);
    const emailCol = getColIndex(s,'Email') - 1;
    const allRows  = s.getDataRange().getValues();
    for (let i = allRows.length - 1; i >= 1; i--) {
      if (String(allRows[i][emailCol]).toLowerCase() === String(data.email).toLowerCase()) {
        s.deleteRow(i + 1);
      }
    }
  });
  // Confirm email to learner
  try {
    MailApp.sendEmail({
      to: data.email,
      subject: '✅ Your data has been deleted — Lithala LMS',
      body: `Hi,\n\nYour request to delete all personal data from Lithala LMS has been approved and completed.\n\nAll your registration data, progress records, assessment results and purchase history have been permanently removed.\n\nThank you for using Lithala LMS.\n\n— Lithala Risk Solutions\ninfo@lithala.com | lithala.com`
    });
  } catch(e) {}
  return { success: true };
}

function payfastNotify(data) {
  if (data.payment_status === 'COMPLETE') {
    savePurchase({
      email: data.email_address,
      courseId: (data.payment_id || '').split('-')[1] || '',
      courseName: data.item_name,
      price: 'R ' + data.amount_gross,
      paymentRef: data.pf_payment_id
    });
  }
  return { success: true };
}

// ── EMAIL — LEARNER RESULT ────────────────────────────────────
function sendResultEmail(email, name, courseName, score, total, passed, certNum) {
  const pct    = Math.round((score/total)*100);
  const status = passed ? '✅ PASSED' : '❌ Not Yet Competent';
  const dashUrl = SITE_URL + '/dashboard3.html';
  try {
    MailApp.sendEmail({
      to: email,
      subject: `${passed ? '🏆' : '📋'} Assessment Result — ${courseName} | Lithala LMS`,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0eae4;border-radius:12px;overflow:hidden">
          <div style="background:${passed?'#1a3a2a':'#0d2b52'};padding:28px;text-align:center">
            <h1 style="color:#52b788;margin:0;font-size:26px">LITHALA LMS</h1>
            <p style="color:rgba(255,255,255,.7);margin:6px 0 0;font-size:13px">Risk Solutions</p>
          </div>
          <div style="padding:32px;background:#f8f4ec">
            <h2 style="color:#1a3a2a;margin-bottom:6px">Assessment Complete</h2>
            <p style="color:#555;margin-bottom:20px">Hi ${name},</p>
            <p style="color:#555;line-height:1.7">You have completed the assessment for <strong>${courseName}</strong>.</p>
            <div style="background:${passed?'#e8f5e9':'#fff3e0'};border-left:4px solid ${passed?'#52b788':'#f4a261'};padding:22px;border-radius:8px;margin:20px 0;text-align:center">
              <div style="font-size:48px;font-weight:bold;color:${passed?'#2d6a4f':'#e65100'}">${pct}%</div>
              <div style="font-size:20px;color:${passed?'#2d6a4f':'#e65100'};font-weight:bold;margin-top:6px">${status}</div>
              <div style="color:#555;margin-top:8px;font-size:14px">${score} out of ${total} correct</div>
            </div>
            ${passed ? `
              <div style="background:#e3f2fd;border-radius:8px;padding:18px;margin-bottom:20px">
                <h3 style="color:#0d2b52;margin:0 0 8px">🏆 Certificate Details</h3>
                <p style="color:#555;margin:0;font-size:13px;line-height:1.7">
                  <strong>Certificate No:</strong> ${certNum}<br>
                  <strong>Course:</strong> ${courseName}<br>
                  <strong>Score:</strong> ${pct}%<br>
                  <strong>Valid for:</strong> 2 Years<br>
                  <strong>Issued:</strong> ${new Date().toLocaleDateString('en-ZA')}
                </p>
              </div>
              <p style="color:#555;line-height:1.7">Your certificate PDF can be downloaded from your <a href="${dashUrl}" style="color:#1565c0;font-weight:bold">dashboard</a>. Share it to LinkedIn directly from there.</p>
            ` : `
              <p style="color:#555;line-height:1.7">You need <strong>80%</strong> to pass. Review the course material and retake the assessment from your <a href="${dashUrl}" style="color:#1565c0">dashboard</a>.</p>
            `}
            <div style="text-align:center;margin-top:24px">
              <a href="${dashUrl}" style="display:inline-block;background:#1565c0;color:white;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Go to My Dashboard →</a>
            </div>
          </div>
          <div style="padding:18px;text-align:center;color:#aaa;font-size:12px;background:#fff;border-top:1px solid #f0f4f8">
            <p>© 2025 Lithala Risk Solutions (Pty) Ltd · <a href="https://lithala.com" style="color:#1565c0">lithala.com</a> · info@lithala.com · +27 (0) 82 421 4001</p>
          </div>
        </div>`
    });
  } catch(e) { Logger.log('Learner result email failed: ' + e); }
}

// ── EMAIL — ADMIN ALERT (both addresses) ─────────────────────
function sendAdminResultAlert(email, name, courseName, score, total, passed, certNum) {
  const pct     = Math.round((score/total)*100);
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID;

  ADMIN_EMAILS.forEach(adminEmail => {
    try {
      MailApp.sendEmail({
        to: adminEmail,
        subject: `${passed?'🏆 PASS':'❌ FAIL'} — ${name} | ${courseName} | Lithala LMS`,
        htmlBody: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0eae4;border-radius:12px;overflow:hidden">
            <div style="background:#0d2b52;padding:20px 28px;display:flex;align-items:center;gap:12px">
              <div>
                <h2 style="color:#64b5f6;margin:0;font-size:18px">LITHALA LMS — Admin Alert</h2>
                <p style="color:rgba(255,255,255,.6);margin:3px 0 0;font-size:12px">Assessment ${passed?'Passed ✅':'Failed ❌'}</p>
              </div>
            </div>
            <div style="padding:28px;background:#f8f4ec">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold;border-radius:4px;width:38%">Learner Name</td><td style="padding:9px 14px">${name}</td></tr>
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold;margin-top:4px">Email</td><td style="padding:9px 14px">${email}</td></tr>
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold">Course</td><td style="padding:9px 14px">${courseName}</td></tr>
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold">Score</td><td style="padding:9px 14px;font-weight:bold;color:${passed?'#2d6a4f':'#c62828'}">${score}/${total} (${pct}%) — ${passed?'PASSED':'NOT YET COMPETENT'}</td></tr>
                ${passed ? `
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold">Certificate No.</td><td style="padding:9px 14px;color:#1565c0;font-weight:bold">${certNum}</td></tr>
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold">Valid Until</td><td style="padding:9px 14px">${new Date(Date.now()+2*365*24*60*60*1000).toLocaleDateString('en-ZA')}</td></tr>
                ` : ''}
                <tr><td style="padding:9px 14px;background:#e3f2fd;font-weight:bold">Date & Time</td><td style="padding:9px 14px">${new Date().toLocaleString('en-ZA')}</td></tr>
              </table>
              <div style="margin-top:22px;text-align:center">
                <a href="${sheetUrl}" style="display:inline-block;background:#1565c0;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">View in Google Sheet →</a>
              </div>
            </div>
          </div>`
      });
    } catch(e) { Logger.log('Admin alert email failed for ' + adminEmail + ': ' + e); }
  });
}

// ── EMAIL — WELCOME ───────────────────────────────────────────
function sendWelcomeEmail(email, name) {
  const dashUrl = SITE_URL + '/dashboard3.html';
  try {
    MailApp.sendEmail({
      to: email,
      subject: '🛡️ Welcome to Lithala LMS',
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0eae4;border-radius:12px;overflow:hidden">
          <div style="background:#1a3a2a;padding:30px;text-align:center">
            <h1 style="color:#52b788;margin:0;font-size:28px">LITHALA LMS</h1>
            <p style="color:rgba(255,255,255,.7);margin:8px 0 0">Risk Solutions</p>
          </div>
          <div style="padding:32px;background:#f8f4ec">
            <h2 style="color:#1a3a2a">Welcome, ${name}! 🎓</h2>
            <p style="color:#555;line-height:1.7">Your Lithala LMS account has been created. You can now browse and purchase HSE courses, track your progress, and earn verified digital certificates.</p>
            <ul style="color:#555;line-height:2;margin:16px 0">
              <li>8 accredited HSE courses available</li>
              <li>Learn via browser or WhatsApp</li>
              <li>Earn verified certificates with QR codes</li>
              <li>Results emailed on every assessment</li>
            </ul>
            <div style="text-align:center;margin-top:22px">
              <a href="${dashUrl}" style="display:inline-block;background:#1565c0;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Go to My Dashboard →</a>
            </div>
          </div>
          <div style="padding:18px;text-align:center;color:#aaa;font-size:12px;background:#fff;border-top:1px solid #f0f4f8">
            <p>© 2025 Lithala Risk Solutions (Pty) Ltd · <a href="https://lithala.com" style="color:#1565c0">lithala.com</a> · +27 (0) 82 421 4001</p>
          </div>
        </div>`
    });
  } catch(e) { Logger.log('Welcome email failed: ' + e); }
}

// ── EMAIL — ADMIN NOTIFY (generic) ───────────────────────────
function notifyAdmins(subject, message) {
  try {
    ADMIN_EMAILS.forEach(email => {
      MailApp.sendEmail({
        to: email,
        subject: '[Lithala LMS] ' + subject,
        body: message + '\n\nTimestamp: ' + new Date().toISOString() + '\n\nView data: https://docs.google.com/spreadsheets/d/' + SHEET_ID
      });
    });
  } catch(e) { Logger.log('Admin notify failed: ' + e); }
}

// ── SHEET UTILITIES ───────────────────────────────────────────
function getSheet(name) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    setupSheetHeaders(sheet, name);
  }
  return sheet;
}

function setupSheetHeaders(sheet, name) {
  const headers = {
    Users:           ['UserID','Email','Name','Photo','GoogleID','RegisteredAt','LastLogin','Status'],
    Purchases:       ['PurchaseID','Email','CourseID','CourseName','Price','PaymentRef','PurchasedAt','Status','ExpiresAt'],
    Progress:        ['ProgressID','Email','CourseID','ModuleID','ModuleName','Score','Completed','StartedAt','UpdatedAt'],
    Results:         ['ResultID','Email','Name','CourseID','CourseName','Score','TotalQuestions','Percentage','Passed','CertificateNo','SubmittedAt','Answers'],
    DeletionRequests:['RequestID','Email','Name','Reason','RequestedAt','Status','ApprovedBy','ApprovedAt']
  };
  if (headers[name]) {
    sheet.getRange(1,1,1,headers[name].length).setValues([headers[name]])
      .setBackground('#1a3a2a').setFontColor('#ffffff').setFontWeight('bold');
  }
}

function getHeaders(sheet) {
  return sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
}

function getColIndex(sheet, colName) {
  const headers = getHeaders(sheet);
  return headers.indexOf(colName) + 1;
}

function appendRow(sheet, obj) {
  const headers = getHeaders(sheet);
  const row     = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sheet.appendRow(row);
}

function findRow(sheet, colName, value) {
  const col  = getColIndex(sheet, colName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col-1]).toLowerCase() === String(value).toLowerCase())
      return { row: i+1, data: data[i] };
  }
  return null;
}

function findAllRows(sheet, colName, value) {
  const col     = getColIndex(sheet, colName);
  const data    = sheet.getDataRange().getValues();
  const results = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col-1]).toLowerCase() === String(value).toLowerCase())
      results.push(i+1);
  }
  return results;
}

function findRowMulti(sheet, conditions) {
  const data    = sheet.getDataRange().getValues();
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
  const data    = sheet.getDataRange().getValues();
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
  const row     = sheet.getRange(rowNum,1,1,headers.length).getValues()[0];
  const obj     = {};
  headers.forEach((h, i) => { obj[h] = row[i]; });
  return obj;
}
