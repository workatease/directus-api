# directus-api

A repo to manually move the directus API to Heroku's Free Dynos and much more...

---

## Custom Endpoints

### 1. Custom Register Flow

1. user register with first name,last Name and Email
2. send email to verify the email
3. user verifies email by clicking on the link and sets the new password

Configuration Steps [click here](extensions/endpoints/register/README.md)

---

## Hooks

### 1. Google [reCAPTCHA](https://www.google.com/recaptcha/about/) v2

Google reCAPTCHA added for `auth.login.before` hook to verify the google response from Front End before signin and signup pages.

- [x] Google reCAPTCHA
- [ ] Mandate URL list from environment variables

Configuration Steps [click here](extensions/hooks/google-recaptcha-v2/README.md)
