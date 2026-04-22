// ============================================================
// LITHALA LMS — Auth + PayFast Module  v3 (FIXED)
// ============================================================

// ── GOOGLE SIGN-IN ────────────────────────────────────────────
function initGoogleAuth() {
  if (!LMS.GOOGLE_CLIENT_ID || LMS.GOOGLE_CLIENT_ID.includes('YOUR_')) return;
  if (typeof google === 'undefined') return;
  google.accounts.id.initialize({
    client_id: LMS.GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
  });
}

// Called by Google GSI library after user picks an account
function handleGoogleCredential(response) {
  try {
    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) {
      lmsToast('Google sign-in failed — could not read account info.', 'error');
      return;
    }
    const user = {
      email:        payload.email,
      name:         payload.name  || payload.email.split('@')[0],
      photo:        payload.picture || '',
      googleId:     payload.sub   || '',
      loginMethod:  'google',
      registeredAt: new Date().toISOString(),
    };
    lmsSetUser(user);
    lmsFetch({ action: 'registerUser', ...user }).catch(() => {});
    window.location.href = 'dashboard3.html';
  } catch (e) {
    console.error('Google sign-in error', e);
    lmsToast('Google sign-in failed. Please try email login.', 'error');
  }
}

// Also used as the data-callback on g_id_onload elements
function handleCredentialResponse(response) {
  handleGoogleCredential(response);
}

function triggerGoogleSignIn() {
  // If no real Client ID, use demo mode
  if (!LMS.GOOGLE_CLIENT_ID || LMS.GOOGLE_CLIENT_ID.includes('YOUR_')) {
    const user = {
      email:        'demo@gmail.com',
      name:         'Demo Learner',
      photo:        '',
      loginMethod:  'google-demo',
      registeredAt: new Date().toISOString(),
    };
    lmsSetUser(user);
    window.location.href = 'dashboard3.html';
    return;
  }
  // Real Google One Tap prompt
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap was blocked — fall back to renderButton
        const target = document.getElementById('googleBtnTarget');
        if (target) {
          google.accounts.id.renderButton(target, {
            theme: 'outline', size: 'large', width: 340,
          });
        }
      }
    });
  }
}

// ── EMAIL AUTH ────────────────────────────────────────────────
function lmsEmailLogin(email, password) {
  if (!email) { lmsToast('Please enter your email address.', 'error'); return false; }
  const user = {
    email,
    name:         email.split('@')[0],
    photo:        '',
    loginMethod:  'email',
    registeredAt: new Date().toISOString(),
  };
  lmsSetUser(user);
  lmsFetch({ action: 'registerUser', ...user }).catch(() => {});
  return true;
}

function lmsEmailRegister(first, last, email, whatsapp, password) {
  if (!first || !email) { lmsToast('Please fill in all required fields.', 'error'); return false; }
  const user = {
    email,
    name:         (first + ' ' + last).trim(),
    photo:        '',
    whatsapp:     whatsapp || '',
    loginMethod:  'email',
    registeredAt: new Date().toISOString(),
  };
  lmsSetUser(user);
  lmsFetch({ action: 'registerUser', ...user }).catch(() => {});
  return true;
}

// ── USER STATE ────────────────────────────────────────────────
function lmsSetUser(user) {
  localStorage.setItem('lms_user', JSON.stringify(user));
}
function lmsGetUser() {
  try { return JSON.parse(localStorage.getItem('lms_user') || 'null'); } catch { return null; }
}
function lmsLogout() {
  localStorage.removeItem('lms_user');
  window.location.href = 'index.html';
}

// ── PAYFAST CHECKOUT ──────────────────────────────────────────
function lmsPayFast(course, user) {
  if (!course || !user) { lmsToast('Please sign in first.', 'error'); return; }
  const pf     = LMS.PAYFAST || {};
  const isDemo = !pf.MERCHANT_ID || pf.MERCHANT_ID.includes('YOUR_');

  if (isDemo || pf.SANDBOX) {
    showPaymentModal(course, user);
    return;
  }

  // Real PayFast — build and submit form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = pf.SANDBOX
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const fields = {
    merchant_id:      pf.MERCHANT_ID,
    merchant_key:     pf.MERCHANT_KEY,
    return_url:       LMS.SITE_URL + '/dashboard3.html?purchase=' + course.id,
    cancel_url:       LMS.SITE_URL + '/index3.html?cancelled=1',
    notify_url:       LMS.SCRIPT_URL + '?action=payfastNotify',
    name_first:       (user.name || '').split(' ')[0] || 'Learner',
    name_last:        (user.name || '').split(' ').slice(1).join(' ') || 'User',
    email_address:    user.email,
    item_name:        course.title,
    item_description: 'Lithala LMS — ' + course.title + ' (' + course.subtitle + ')',
    amount:           course.price.toFixed(2),
    payment_id:       'LTH-' + course.id + '-' + Date.now(),
  };

  Object.entries(fields).forEach(([k, v]) => {
    const inp = document.createElement('input');
    inp.type = 'hidden'; inp.name = k; inp.value = v;
    form.appendChild(inp);
  });
  document.body.appendChild(form);
  form.submit();
}

// ── PAYMENT MODAL ─────────────────────────────────────────────
function showPaymentModal(course, user) {
  const existing = document.getElementById('paymentModal');
  if (existing) existing.remove();

  const pf      = LMS.PAYFAST || {};
  const isDemo  = !pf.MERCHANT_ID || pf.MERCHANT_ID.includes('YOUR_');
  const notice  = isDemo
    ? `<div style="background:#fff8e1;border-left:4px solid #d4a017;padding:12px 20px;font-size:12px;color:#555"><strong>⚠ Demo Mode:</strong> Add your PayFast Merchant ID to lms-config.js for real payments. Clicking Pay will simulate a successful purchase.</div>`
    : `<div style="background:#e3f2fd;border-left:4px solid #1565c0;padding:12px 20px;font-size:12px;color:#555"><strong>🧪 Sandbox Mode:</strong> Test payments only — no real money charged.</div>`;

  const modal = document.createElement('div');
  modal.id = 'paymentModal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:99999;align-items:center;justify-content:center;backdrop-filter:blur(6px);padding:16px';
  modal.innerHTML = `
    <div style="background:white;border-radius:22px;width:100%;max-width:480px;overflow:hidden;font-family:'DM Sans',sans-serif;animation:mIn .3s ease">
      <div style="background:linear-gradient(135deg,#0d2b52,#1565c0);padding:22px 26px;color:white;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:18px">Secure Checkout</div>
          <div style="font-size:12px;opacity:.7;margin-top:2px">Powered by PayFast${isDemo ? ' · DEMO MODE' : ' · SANDBOX'}</div>
        </div>
        <button onclick="document.getElementById('paymentModal').remove()" style="background:rgba(255,255,255,.15);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:17px;cursor:pointer;line-height:1">✕</button>
      </div>
      <div style="padding:20px 26px;border-bottom:1px solid #f0f4f8;display:flex;gap:13px;align-items:center">
        <img src="${course.image}" style="width:68px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0" onerror="this.style.display='none'" alt="">
        <div style="flex:1;min-width:0">
          <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#0d2b52">${course.title}</div>
          <div style="font-size:11px;color:#2196f3;margin-top:2px">${course.subtitle}</div>
          <div style="font-size:10px;color:#aaa;margin-top:3px">⏱ ${course.duration} · 📋 ${course.modules} modules · 🏆 Certificate on pass</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:#0d2b52">R ${course.price.toLocaleString()}</div>
          <div style="font-size:10px;color:#aaa">incl. VAT</div>
        </div>
      </div>
      ${notice}
      <div style="padding:20px 26px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div><label style="font-size:11px;font-weight:600;color:#1a3a2a;display:block;margin-bottom:4px">First Name</label>
            <input id="pf_first" type="text" value="${(user.name||'').split(' ')[0]}" style="width:100%;padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:#f5f7f5;outline:none"></div>
          <div><label style="font-size:11px;font-weight:600;color:#1a3a2a;display:block;margin-bottom:4px">Last Name</label>
            <input id="pf_last" type="text" value="${(user.name||'').split(' ').slice(1).join(' ')}" style="width:100%;padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:#f5f7f5;outline:none"></div>
        </div>
        <div style="margin-bottom:12px"><label style="font-size:11px;font-weight:600;color:#1a3a2a;display:block;margin-bottom:4px">Email</label>
          <input id="pf_email" type="email" value="${user.email||''}" style="width:100%;padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:#f5f7f5;outline:none"></div>
        <div style="background:#f5f7f5;border:1px solid #e0eae4;border-radius:10px;padding:13px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:#0d2b52;margin-bottom:9px">💳 Card Details</div>
          <input placeholder="1234 5678 9012 3456" style="width:100%;padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:white;outline:none;margin-bottom:7px;letter-spacing:1px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <input placeholder="MM / YY" style="padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:white;outline:none">
            <input placeholder="CVV" style="padding:10px 12px;border:2px solid #e0eae4;border-radius:8px;font-size:13px;background:white;outline:none">
          </div>
          <div style="font-size:10px;color:#aaa;margin-top:8px;text-align:center">🔒 Secured by PayFast · PCI DSS Level 1</div>
        </div>
        <button onclick="processDemoPayment('${course.id}')" style="width:100%;background:linear-gradient(135deg,#1565c0,#2196f3);color:white;border:none;padding:14px;border-radius:10px;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 4px 15px rgba(21,101,192,.35)">
          Pay R ${course.price.toLocaleString()} Securely →
        </button>
        <p style="text-align:center;font-size:11px;color:#aaa;margin-top:9px">By paying you agree to our <a href="#" style="color:#1565c0">Terms of Service</a>. Instant access after payment.</p>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function processDemoPayment(courseId) {
  const user = lmsGetUser();
  if (!user) { window.location.href = 'dashboard3.html'; return; }

  const purchases = JSON.parse(localStorage.getItem('lms_purchases') || '[]');
  if (!purchases.find(p => p.courseId === courseId)) {
    purchases.push({ courseId, purchasedAt: new Date().toISOString(), paymentRef: 'DEMO-' + Date.now() });
    localStorage.setItem('lms_purchases', JSON.stringify(purchases));
  }

  const course = (LMS.COURSES || []).find(c => c.id === courseId);
  lmsFetch({
    action:     'savePurchase',
    email:      user.email,
    courseId,
    courseName: course ? course.title : courseId,
    price:      course ? 'R ' + course.price : 'R 0',
    paymentRef: 'DEMO-' + Date.now(),
  }).catch(() => {});

  document.getElementById('paymentModal')?.remove();
  lmsToast('✅ Purchase successful! Redirecting to your dashboard...', 'success');
  setTimeout(() => { window.location.href = 'dashboard3.html'; }, 1800);
}

// ── APPS SCRIPT FETCH ─────────────────────────────────────────
function lmsFetch(data) {
  if (!LMS.SCRIPT_URL || LMS.SCRIPT_URL.includes('YOUR_')) {
    return Promise.resolve({ success: true, demo: true });
  }
  return fetch(LMS.SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(r => r.json());
}

// ── TOAST ─────────────────────────────────────────────────────
function lmsToast(message, type) {
  type = type || 'info';
  const existing = document.getElementById('lmsToast');
  if (existing) existing.remove();
  const colors = { success:'#2d6a4f', error:'#c62828', info:'#1565c0', warning:'#d4a017' };
  const icons  = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast  = document.createElement('div');
  toast.id = 'lmsToast';
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + colors[type] + ';color:white;padding:13px 22px;border-radius:10px;font-family:DM Sans,sans-serif;font-size:14px;font-weight:500;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px;max-width:90vw;text-align:center;transition:opacity .4s';
  toast.innerHTML = icons[type] + ' ' + message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  setTimeout(() => { toast.remove(); }, 3500);
}

// ── JWT HELPER ────────────────────────────────────────────────
function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch (e) { console.error('JWT parse error', e); return null; }
}

// ── RETURN URL HANDLER (after PayFast redirect) ───────────────
function lmsHandleReturnUrl() {
  const params     = new URLSearchParams(window.location.search);
  const purchaseId = params.get('purchase');
  if (purchaseId) {
    processDemoPayment(purchaseId);
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ── INIT ──────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initGoogleAuth();
    lmsHandleReturnUrl();
  });
} else {
  initGoogleAuth();
  lmsHandleReturnUrl();
}
