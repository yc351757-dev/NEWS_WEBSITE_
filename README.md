# SkillPilot Tasks — React Todo App for Learning Goals

SkillPilot Tasks is a dark-themed, responsive React task manager designed around skill development. Instead of generic to-dos, tasks are attached to learning paths such as React, Python, SQL, Data Science, Git & Tools, and Career Prep.

## Features

- Dark, responsive dashboard and mobile layout.
- Create, edit, complete, and delete learning tasks.
- Categorize tasks by skill path.
- Set priority, due date, estimated time, and notes.
- Filter by All tasks, Today, Upcoming, Overdue, and Completed.
- Search by title, skill, priority, or notes.
- Sort by priority, due date, or recently created.
- Overview stats for open tasks, today's plan, weekly completions, time remaining, and skill progress.
- Skill paths page with per-category completion summaries.
- Profile preferences including display name, daily learning goal, and focus skill.
- JSON export of tasks and preferences.
- LocalStorage persistence; no backend or API key required.
- Starter tasks included to make the app demo-ready on first launch.

## Tech stack

- React
- Vite
- JavaScript (ES modules)
- CSS (custom responsive styling)
- Browser LocalStorage

## Requirements

- Node.js 18+ recommended.
- npm.

## Run on Windows

1. Extract the ZIP.
2. Open the extracted `SkillPilot_Todo` folder — `package.json` must be directly inside this folder.
3. In File Explorer, click the address bar, type `powershell`, and press Enter.
4. Run:

```powershell
npm install
npm run dev
```

5. Open the local URL shown by Vite, usually `http://localhost:5173/`.

To create and preview a production build:

```powershell
npm run build
npm run preview
```

## Data and privacy

Tasks and preferences are stored locally in the browser under `skillpilot-todo-v1`. No account, backend, or remote API is used. Clearing browser storage may delete the saved tasks, so use **Settings → Export JSON** to create a backup.

## Skill completion calculations

For each skill path:

`completion % = completed tasks in that skill / total tasks in that skill × 100`

Overall completion is calculated using all tasks. Tasks with no items in a skill do not count toward that skill's percentage.

## Project structure

```text
SkillPilot_Todo/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles.css
```

## Demo checklist

1. Open Overview and review starter tasks and skill stats.
2. Add a task for Python or React and include a due date and time estimate.
3. Complete a task and observe progress statistics update.
4. Use My Tasks filters and search.
5. Open Skill Paths and add a task to a particular path.
6. Edit your name and focus skill in Settings.
7. Export your learning plan as JSON.

## Limitations

- Data is local to the current browser and is not synced across devices.
- The starter tasks are demo content and can be edited or deleted.
- This task manager does not claim to use generative AI; its learning categories and progress calculations are deterministic.
