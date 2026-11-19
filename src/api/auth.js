const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function getFirebaseErrorMessage(errorCode) {
  const messages = {
    EMAIL_EXISTS: "An account with this email already exists.",
    INVALID_EMAIL: "Please enter a valid email address.",
    WEAK_PASSWORD: "Your password must be at least 6 characters long.",
    OPERATION_NOT_ALLOWED: "Email and password sign-up is currently disabled.",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again later.",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
    EMAIL_NOT_FOUND: "No account was found with this email.",
    INVALID_PASSWORD: "Incorrect password. Please try again.",
    USER_DISABLED: "This account has been disabled.",
  };

  return messages[errorCode] || "Something went wrong. Please try again.";
}

async function authenticate(operation, email, password) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${operation}?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getFirebaseErrorMessage(data.error.message));
  }

  return data;
}

export function signup(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}
