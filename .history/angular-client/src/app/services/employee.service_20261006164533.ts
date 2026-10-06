// ============================================================
//  Employee creation — form handling + User ID existence check
// ============================================================

const API_BASE = 'http://localhost:5251/api';

const form         = document.getElementById('employeeForm');
const submitBtn    = document.getElementById('submitBtn');
const resetBtn     = document.getElementById('resetBtn');
const formMessage  = document.getElementById('formMessage');
const userIdInput  = document.getElementById('userId');
const statusIcon   = document.getElementById('userCheckIcon');

// Tracks whether the last User ID check succeeded.
let userIdIsValid = false;
let userCheckTimer = null;   // debounce timer

// ------------------------------------------------------------
//  Field-level helpers
// ------------------------------------------------------------

const fields = {
  userId:         { el: userIdInput,                                        errorEl: document.getElementById('userIdError') },
  role:           { el: document.getElementById('role'),                    errorEl: document.getElementById('roleError') },
  firstName:      { el: document.getElementById('firstName'),               errorEl: document.getElementById('firstNameError') },
  lastName:       { el: document.getElementById('lastName'),                errorEl: document.getElementById('lastNameError') },
  email:          { el: document.getElementById('email'),                   errorEl: document.getElementById('emailError') },
  phoneNumber:    { el: document.getElementById('phoneNumber'),             errorEl: document.getElementById('phoneNumberError') },
  department:     { el: document.getElementById('department'),              errorEl: document.getElementById('departmentError') },
  jobTitle:       { el: document.getElementById('jobTitle'),                errorEl: document.getElementById('jobTitleError') },
  hireDate:       { el: document.getElementById('hireDate'),                errorEl: document.getElementById('hireDateError') },
};

function setFieldError(name, message) {
  const f = fields[name];
  if (!f) return;
  f.errorEl.textContent = message || '';
  f.el.classList.toggle('invalid', Boolean(message));
}

function clearFieldError(name) {
  setFieldError(name, '');
}

function clearAllErrors() {
  Object.keys(fields).forEach(clearFieldError);
  hideMessage();
}

// ------------------------------------------------------------
//  Message banner
// ------------------------------------------------------------

function showMessage(text, type = 'success') {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.hidden = false;
}

function hideMessage() {
  formMessage.hidden = true;
  formMessage.textContent = '';
}

// ------------------------------------------------------------
//  User ID existence check
// ------------------------------------------------------------

async function checkUserIdExists(id) {
  // Quick client-side guard
  if (!id || Number(id) <= 0) {
    return { ok: false, message: 'User ID must be a positive number.' };
  }

  try {
    const res = await fetch(`${API_BASE}/User/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.status === 404) {
      return { ok: false, message: `No user found with ID ${id}.` };
    }
    if (!res.ok) {
      return { ok: false, message: `Could not verify User ID (HTTP ${res.status}).` };
    }

    const user = await res.json();
    const displayName =
      user.fullName || user.username || user.email || `#${id}`;
    return { ok: true, message: `Linked to ${displayName}.` };
  } catch (err) {
    return { ok: false, message: 'Cannot reach the server. Is the API running?' };
  }
}

function setUserCheckState(state) {
  // state: 'idle' | 'checking' | 'ok' | 'bad'
  statusIcon.classList.remove('checking', 'ok', 'bad');
  if (state !== 'idle') statusIcon.classList.add(state);
}

userIdInput.addEventListener('input', () => {
  userIdIsValid = false;
  clearFieldError('userId');

  const value = userIdInput.value.trim();
  if (!value) {
    setUserCheckState('idle');
    return;
  }

  // Debounce so we don't hammer the API on every keystroke
  clearTimeout(userCheckTimer);
  setUserCheckState('checking');
  userCheckTimer = setTimeout(async () => {
    const result = await checkUserIdExists(value);
    userIdIsValid = result.ok;
    setUserCheckState(result.ok ? 'ok' : 'bad');
    userIdInput.classList.toggle('valid', result.ok);
    userIdInput.classList.toggle('invalid', !result.ok);
    if (!result.ok) setFieldError('userId', result.message);
    else         clearFieldError('userId');
  }, 500);
});

// ------------------------------------------------------------
//  Validation
// ------------------------------------------------------------

function validateForm() {
  let valid = true;
  clearAllErrors();

  // User ID
  if (!userIdInput.value.trim()) {
    setFieldError('userId', 'User ID is required.');
    valid = false;
  } else if (!userIdIsValid) {
    setFieldError('userId', 'User ID does not exist or has not been verified.');
    valid = false;
  }

  // Role
  if (!fields.role.el.value) {
    setFieldError('role', 'Please select a role.');
    valid = false;
  }

  // First / Last name
  if (!fields.firstName.el.value.trim()) {
    setFieldError('firstName', 'First name is required.');
    valid = false;
  }
  if (!fields.lastName.el.value.trim()) {
    setFieldError('lastName', 'Last name is required.');
    valid = false;
  }

  // Email (simple pattern; server re-validates)
  const email = fields.email.el.value.trim();
  if (!email) {
    setFieldError('email', 'Email is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('email', 'Enter a valid email address.');
    valid = false;
  }

  // Department + Job title + Hire date
  if (!fields.department.el.value) {
    setFieldError('department', 'Please select a department.');
    valid = false;
  }
  if (!fields.jobTitle.el.value.trim()) {
    setFieldError('jobTitle', 'Job title is required.');
    valid = false;
  }
  if (!fields.hireDate.el.value) {
    setFieldError('hireDate', 'Hire date is required.');
    valid = false;
  }

  return valid;
}

// ------------------------------------------------------------
//  Build payload
// ------------------------------------------------------------

function buildPayload() {
  return {
    userId:         Number(userIdInput.value),
    role:           fields.role.el.value,
    firstName:      fields.firstName.el.value.trim(),
    lastName:       fields.lastName.el.value.trim(),
    email:          fields.email.el.value.trim(),
    phoneNumber:    fields.phoneNumber.el.value.trim() || null,
    dateOfBirth:    document.getElementById('dateOfBirth').value || null,
    gender:         document.getElementById('gender').value || null,
    department:     fields.department.el.value,
    jobTitle:       fields.jobTitle.el.value.trim(),
    hireDate:       fields.hireDate.el.value,
    employmentType: document.getElementById('employmentType').value || null,
    salary:         document.getElementById('salary').value
                      ? Number(document.getElementById('salary').value)
                      : null,
    status:         document.getElementById('status').value,
    county:         document.getElementById('county').value.trim() || null,
    town:           document.getElementById('town').value.trim() || null,
    postalAddress:  document.getElementById('postalAddress').value.trim() || null,
  };
}

// ------------------------------------------------------------
//  Submit
// ------------------------------------------------------------

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  if (!validateForm()) {
    showMessage('Please fix the highlighted fields.', 'error');
    // scroll to first invalid field
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Re-verify the User ID right before submit — user might have cleared it
  const check = await checkUserIdExists(userIdInput.value.trim());
  if (!check.ok) {
    setFieldError('userId', check.message);
    showMessage(check.message, 'error');
    return;
  }

  const payload = buildPayload();

  setSubmitting(true);
  try {
    const res = await fetch(`${API_BASE}/Employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 201 || res.ok) {
      const created = await res.json().catch(() => null);
      const name = created
        ? `${created.firstName} ${created.lastName}`
        : `${payload.firstName} ${payload.lastName}`;
      showMessage(`Employee "${name}" created successfully.`, 'success');
      form.reset();
      userIdIsValid = false;
      setUserCheckState('idle');
      Object.values(fields).forEach(f => f.el.classList.remove('valid', 'invalid'));
    } else if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      showMessage(body.message || 'Invalid data. Please review the form.', 'error');
    } else if (res.status === 409) {
      showMessage('An employee with this User ID or email already exists.', 'error');
    } else if (res.status === 404) {
      showMessage('The linked user no longer exists. Pick a different User ID.', 'error');
    } else {
      showMessage(`Server error (HTTP ${res.status}).`, 'error');
    }
  } catch (err) {
    showMessage('Network error — could not reach the API. Is the server running?', 'error');
  } finally {
    setSubmitting(false);
  }
});

function setSubmitting(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  submitBtn.querySelector('.btn-label').textContent =
    isSubmitting ? 'Creating…' : 'Create Employee';
  submitBtn.querySelector('.btn-spinner').hidden = !isSubmitting;
}

// ------------------------------------------------------------
//  Reset
// ------------------------------------------------------------

resetBtn.addEventListener('click', () => {
  form.reset();
  userIdIsValid = false;
  setUserCheckState('idle');
  Object.values(fields).forEach(f => f.el.classList.remove('valid', 'invalid'));
  clearAllErrors();
  hideMessage();
});

// ------------------------------------------------------------
//  Default hire date to today
// ------------------------------------------------------------

document.getElementById('hireDate').value =
  new Date().toISOString().substring(0, 10);