# Task Manager (JS Exam Task-Manager)

A small client-side Task Manager web app that lets you add, edit, delete and filter tasks by priority. Tasks are persisted in the browser using `localStorage`, so data survives page reloads on the same machine/browser.

---

**Repository structure**

- `index.html` : Main HTML file containing the UI and three main sections: Add Task, View Tasks, Edit/Delete.
- `css/style.css` : Custom styles for the UI (layout, spacing, simple visual styles). This file was modified to use a static layout and to support showing one active section at a time.
- `js/script.js` : Main application logic: DOM initialization, rendering tasks, add/edit/delete, localStorage handling, priority filtering, and navigation.
- `README.md` : This file.

Example workspace layout:

```
index.html
README.md
css/
	style.css
js/
	script.js
```

---

**App features**

- Add new tasks (name, due date, priority)
- Edit existing tasks (inline via Add Task form)
- Delete tasks
- Persist tasks using `localStorage`
- Filter tasks by priority (All / High / Medium / Low)
- Simple navigation that shows one section at a time (no sliding animation)

---

**How it works (high-level)**

1. On page load the script initializes DOM references, creates missing `tbody` elements if needed, and loads tasks from `localStorage` (if present).
2. Rendering functions build the task rows in two places:
	 - View Tasks table (read-only listing)
	 - Edit/Delete table (shows Edit/Delete buttons)
3. Clicking Edit copies the task into the Add Task form and switches the UI to update mode (button text changes to "Update Task").
4. Submitting the form either creates a new task or updates an existing task; then tasks are saved to `localStorage` and both tables re-render.
5. Priority filter buttons set an internal filter and the tables re-render showing only matching tasks.

---

**Open / Run (no build required)**

1. Clone or copy this repo to your machine.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox). No server or build step required.
3. Use the UI to add tasks. Tasks are saved to the browser's `localStorage` and persist between reloads.

If you prefer a local HTTP server (recommended when developing):

- Python 3 (simple server):

```powershell
# from repository root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

- Or, using VS Code Live Server extension to preview.

---

**Important implementation notes**

- The script ensures `tbody` exists before trying to insert rows. If `tbody` is missing, the script will create it.
- The app expects IDs / indexes to reference tasks in the current array ordering. When filtering is applied, indexes are interpreted relative to the underlying `tasks` array (the filter implementation takes care of presenting the right items — see code comments in `js/script.js`).
- Editing a task uses an internal `currentIdx` to track which item is being updated; the Add Task form is reused for both add and update modes.

---

**Where to look in code**

- `js/script.js`:
	- DOM initialization and `tbody` creation: `setupFormElements()`
	- Rendering: `displayViewTasks()` and `displayEditTasks()`
	- Add/Update/Remove: `createNewTask()`, `submitForm()`, `removeTask()`, `startEditing()`
	- Priority filter helpers: `applyPriorityFilter()` and `getFilteredTasks()`
	- Navigation: `switchPage()`

- `css/style.css`:
	- Controls layout and active section visibility. The `.slide-page.active` rule determines which section is visible.

---

**Common issues & fixes**

- "Nothing appears in the table": Ensure the table has a `tbody` element; the script tries to create one, but verify `js/script.js` is loading and there are no console errors.
- "Tasks disappear after refresh": Verify `localStorage` is available for the site and the browser isn't in private/incognito mode that blocks storage.
- "Edit doesn't prefill the form": Confirm `startEditing()` sets the form values and `currentIdx` is set. Check the browser console for JavaScript errors.

---

**Potential improvements / Next steps**

- Add validation and nicer error messages for input fields (e.g., past dates)
- Add completed / in-progress task statuses and a way to toggle completion
- Add sorting by due date or priority
- Use unique stable IDs and rely on ID for update/delete instead of array index
- Add unit tests for core data functions (pure functions for filtering, adding, updating)
- Persist data on a backend instead of `localStorage` (for multi-device sync)

---

**Contributing**

If you'd like to contribute:

- Fork the repo and open a pull request with your changes.
- Keep UI changes minimal if just improving functionality, and document changes in `README.md`.

---


