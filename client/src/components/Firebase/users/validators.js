function validateUsername(username) {
  return username.trim().length >= 3;
}

function validateEmail(email) {
  // will be validated by firebase
  return email.trim().length > 2 && email.includes("@");
}

function validatePassword(password) {
  return password.trim().length >= 6;
}

export function validateSignup(input) {
  const errors = {};
  if (!validateUsername(input.username)) {
    errors.msg = "Invalid Username";
  }
  if (!validateEmail(input.email)) {
    errors.msg = "Invalid Email";
  }
  if (!validatePassword(input.password)) {
    errors.msg = "Invalid Password";
  }
  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
}

export function validateSignin(input) {
  const errors = {};
  if (!validateEmail(input.email)) {
    errors.msg = "Invalid Email";
  }
  if (!validatePassword(input.password)) {
    errors.msg = "Invalid Password";
  }
  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
}
