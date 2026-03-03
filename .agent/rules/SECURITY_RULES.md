---
trigger: always_on
---

# Repository Security Rules for AI Assistants

This document defines mandatory security practices for any AI assistant or agent working on this repository to prevent data leaks and maintain repository integrity.

## 1. Environment Variable Protection
- **NEVER** commit files ending in `.env`, `.env.local`, or any variant listed in `.gitignore`.
- **PROACTIVELY** verify that any new configuration file being created is added to `.gitignore` if it contains sensitive keys.
- **ALWAYS** check `git ls-files --cached` if you suspect a sensitive file might be tracked accidentally.

## 2. No Hardcoded Secrets
- **NEVER** hardcode API keys, private keys, authentication tokens, or database credentials directly in the source code.
- **USE** environment variables (e.g., `import.meta.env.VITE_*` for Vite/React) and document them in `apps/web/.env.example`.

## 3. Git Hygiene
- **VERIFY** staged changes with `git status` before suggesting or performing a commit.
- **STOP** and notify the user immediately if you detect a secret being committed or already present in the git history.
- **DO NOT** use `git add .` or `git add -A` blindly; stage files explicitly.

## 4. Leak Remediation
- If a secret is accidentally committed:
    1.  Advise the user to **REVOKE** and **ROTATE** the secret immediately.
    2.  Suggest removing the file from git history (e.g., using `git filter-repo` or `git rm --cached`).
    3.  Update `.gitignore` to prevent recurrence.

---
*Failure to follow these rules is a critical security violation.*
