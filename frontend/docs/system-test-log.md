# System Test Execution Log

## Initial Startup Issue
- While running `npm run dev`, the browser console reported `Outdated Optimize Dep` (504) for `react`, `react-dom/client`, and `@tanstack/react-query`.
- This usually means Vite's pre-bundled dependency cache is stale.

## Immediate Remediation
1. Stop the dev server.
2. Remove the cached optimized deps:
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```
   (Alternatively, start with `npm run dev -- --force` to rebuild cache.)
3. Reload the browser once the server restarts.

## Next Steps
- After cache rebuild, re-open the app and proceed with the manual scenarios outlined in `docs/system-test-plan.md` (auth → dashboard → resume builder → jobs → cover letters → portfolio → billing/testing Stripe flows).
- Record findings and any Supabase data verifications as you go.

## Note on continuing 504 errors
- If `rm -rf node_modules/.vite` did not clear the 504s, try forcing cache rebuild:
  ```bash
  cd frontend
  npm run dev -- --force
  ```
- Also make sure you have only one Vite/dev instance running. Stop any previous `npm run dev` before starting the new one.
- As a last resort, delete `node_modules/.vite` *and* the entire `frontend/node_modules`, then reinstall:
  ```bash
  cd frontend
  rm -rf node_modules/.vite
  rm -rf node_modules
  npm install
  npm run dev
  ```
