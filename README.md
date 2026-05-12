# Joris Menten bv

## Local run

1. Run `start-local.ps1` from the project root.
2. Open `http://127.0.0.1:8000/admin.php`.
3. Log in with the admin password and then open the page you want to edit.

## Admin

- Password: `MentenAdmin2026!`
- The editable content lives in `data/site.json`.
- Uploaded images are written to `images/uploads/`.
- Each image field opens a media picker where you can choose an existing file or upload a new one.

## Notes

- If Python is available, the local server uses `local-server.py`.
- If Python is not available but PHP is installed, the script falls back to the PHP built-in server.
- The public site still works through PHP hosting as well.