# git-filter-repo plan (destructive) — READ CAREFULLY

This document describes a safe procedure to purge sensitive values from Git history using `git-filter-repo`.
Do NOT run these steps unless you fully understand the impact. All collaborators will need to re-clone or reset their remotes after this.

1) Prerequisites
- Install git-filter-repo: `pip install git-filter-repo`
- Make a bare mirror backup of the remote repository (always keep an offline copy):

  git clone --mirror git@github.com:chrismaz11/Joblander-Ai.git backup-repo.git

2) Prepare `replacements.txt`
- Edit `rotation/replacements.txt` and add one mapping per leaked literal secret. Format example:

===BEGIN===
OLD_SECRET_VALUE==>REMOVED_IN_HISTORY
ANOTHER_SECRET==>REMOVED_IN_HISTORY
===END===

- DO NOT include passwords or secrets you do not control anymore. Instead, rotate them in the service UI and then remove the string from history if you must.

3) Run the replacement locally on a fresh clone
- Clone a fresh copy (non-bare) to work in:

  git clone git@github.com:chrismaz11/Joblander-Ai.git repo-clean
  cd repo-clean

- Run git-filter-repo with our replacements file (this rewrites history):

  git filter-repo --replace-text ../rotation/replacements.txt

4) Inspect results
- Use `git log --stat` and `git grep 'REMOVED_IN_HISTORY'` to verify removals.
- Run your test suite and linting to ensure no accidental changes to code logic happened.

5) Force push cleaned history (destructive)
- Coordinate with collaborators: everyone must re-clone after this.
- Force push branches and tags:

  git push --force --all origin
  git push --force --tags origin

6) Post-cleanup steps
- Rotate any secrets that were exposed (if you haven't already) — this is critical.
- Update CI and hosting environment variables with the new secret values.
- Ask collaborators to re-clone the repo:

  git clone git@github.com:chrismaz11/Joblander-Ai.git

7) If you prefer an easier but imperfect approach
- Use `bfg` for simpler operations, but git-filter-repo is recommended for precision.

8) Safety notes
- Never store the replacements file in a public place if it contains raw secrets. Prefer local usage of the replacements file and then delete it.
- Consider rotating the key(s) first in the service (Supabase, Stripe, etc.) before rewriting history.

If you'd like, I can:
- Fill `replacements.txt` with the exact literal values if you tell me which strings are secrets and give explicit permission.
- Walk you through each command over a terminal session while you run them locally.
