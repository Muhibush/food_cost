---
trigger: always_on
---

# 🔒 Repository Security Rules

These are mandatory security practices for any AI assistant or agent working on this repository. Violations are treated as critical security incidents.

---

## 1. Environment Variable Protection

- **NEVER** commit files ending in `.env`, `.env.local`, `.env.production`, `.env.development`, or any variant listed in `.gitignore`.
- **PROACTIVELY** verify that any new configuration file containing sensitive keys is added to `.gitignore`.
- **ALWAYS** check `git ls-files --cached` if a sensitive file might be tracked accidentally.
- **Environment files in this project:**
    - `.env.local` — Local development credentials (gitignored)
    - `.env.development` — Dev Firebase config (gitignored)
    - `.env.production` — Prod Firebase config (gitignored)
    - `.env.example` — Template with placeholder values (safe to commit)

---

## 2. No Hardcoded Secrets

- **NEVER** hardcode API keys, private keys, authentication tokens, database credentials, or Firebase config values directly in source code.
- **USE** Vite environment variables: `import.meta.env.VITE_*`
- **DOCUMENT** all required env vars in `.env.example` with placeholder values.
- **Current required variables:**
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`

---

## 3. Git Hygiene

- **VERIFY** staged changes with `git status` before any commit.
- **STOP** and notify the user immediately if a secret is detected in staged changes or git history.
- **DO NOT** use `git add .` or `git add -A` blindly — stage files explicitly.
- **REVIEW** `.gitignore` entries match the project's sensitive files:
    ```
    .env
    .env.local
    .env.*.local
    .env.production
    .env.development
    .firebase/
    ```

---

## 4. Leak Remediation

If a secret is accidentally committed:
1. **REVOKE** and **ROTATE** the compromised secret immediately.
2. Remove the file from git history using `git filter-repo` or `git rm --cached <file>`.
3. Force-push the cleaned history.
4. Update `.gitignore` to prevent recurrence.
5. Verify with `git log --all --full-history -- <file>` that the secret is fully removed.

---

## 5. Firebase Security

- Firebase project configuration is split across environments:
    - **Dev:** `cookcost-dev` (via `.env.development`)
    - **Prod:** `cookcost-prod` (via `.env.production`)
- **Firestore rules** are defined in `firestore.rules` — review before deployment.
- **NEVER** deploy with open Firestore rules (e.g., `allow read, write: if true`) to production.

---

*Failure to follow these rules is a critical security violation.*
