import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'skillpilot-todo-v1';
const SKILLS = [
  { name: 'React', icon: '⚛', tone: 'violet', description: 'Components, hooks and UI patterns' },
  { name: 'Python', icon: '⌘', tone: 'blue', description: 'Programming fundamentals and problem solving' },
  { name: 'SQL', icon: '▤', tone: 'cyan', description: 'Queries, joins and database design' },
  { name: 'Data Science', icon: '◒', tone: 'pink', description: 'Pandas, statistics and machine learning' },
  { name: 'Git & Tools', icon: '⑂', tone: 'orange', description: 'Version control and developer workflow' },
  { name: 'Career Prep', icon: '↗', tone: 'green', description: 'Portfolio, interview and communication' },
];
const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

function localISO(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function dayOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return localISO(d);
}
function makeStarterTasks() {
  const today = dayOffset(0);
  return [
    { id: 'seed-1', title: 'Build a reusable React card component', skill: 'React', priority: 'High', dueDate: today, minutes: 45, notes: 'Use props, a small data array and clean component structure.', completed: false, createdAt: new Date().toISOString(), completedAt: null },
    { id: 'seed-2', title: 'Practice Python lists and dictionaries', skill: 'Python', priority: 'Medium', dueDate: today, minutes: 30, notes: 'Solve 5 short exercises and write down one takeaway.', completed: false, createdAt: new Date().toISOString(), completedAt: null },
    { id: 'seed-3', title: 'Write 8 SQL queries using JOIN', skill: 'SQL', priority: 'High', dueDate: dayOffset(1), minutes: 40, notes: 'Practice INNER JOIN and LEFT JOIN on sample tables.', completed: false, createdAt: new Date().toISOString(), completedAt: null },
    { id: 'seed-4', title: 'Explore a dataset with Pandas', skill: 'Data Science', priority: 'Medium', dueDate: dayOffset(2), minutes: 50, notes: 'Inspect columns, handle missing values and summarize key trends.', completed: false, createdAt: new Date().toISOString(), completedAt: null },
    { id: 'seed-5', title: 'Push your latest project to GitHub', skill: 'Git & Tools', priority: 'Low', dueDate: dayOffset(3), minutes: 20, notes: 'Write a clear README and use a meaningful commit message.', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: 'seed-6', title: 'Add one project to your portfolio', skill: 'Career Prep', priority: 'Low', dueDate: dayOffset(5), minutes: 35, notes: 'Explain the problem, features, tech stack and what you learned.', completed: false, createdAt: new Date().toISOString(), completedAt: null },
  ];
}
function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.tasks) ? parsed : null;
  } catch {
    return null;
  }
}
function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
    checklist: <><path d="m4 6 1.5 1.5L8 5"/><path d="M11 6h9M4 13l1.5 1.5L8 12"/><path d="M11 13h9M4 20l1.5 1.5L8 19"/><path d="M11 20h9"/></>,
    route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.1.8-1.5 2.6-1.3-.5a7.6 7.6 0 0 1-1.8 1l-.2 1.4h-3l-.2-1.4a7.6 7.6 0 0 1-1.8-1l-1.3.5L8 15.9l1.1-.8a7.4 7.4 0 0 1 0-2.1L8 12.2l1.5-2.6 1.3.5a7.6 7.6 0 0 1 1.8-1l.2-1.4h3l.2 1.4a7.6 7.6 0 0 1 1.8 1l1.3-.5 1.5 2.6-1.1.8a7.4 7.4 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16Z"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></>,
    flame: <path d="M12 22c4.4 0 7-3.1 7-7.1 0-3.4-2.4-5.6-4.1-7.2.1 2.2-1.2 3.2-2.1 3.7C13.7 7.5 11.2 3.9 8.7 2 9.2 6.9 5 9.1 5 14.8 5 18.8 7.9 22 12 22Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.spark}</svg>;
}
function formatShortDate(dateStr) {
  if (!dateStr) return 'No due date';
  const d = new Date(`${dateStr}T00:00:00`);
  const today = dayOffset(0);
  const tomorrow = dayOffset(1);
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function dateLabel(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
function isOverdue(task) { return !task.completed && task.dueDate && task.dueDate < dayOffset(0); }
function skillMeta(skill) { return SKILLS.find((x) => x.name === skill) || SKILLS[0]; }

export default function App() {
  const [initial] = useState(() => readSaved());
  const [tasks, setTasks] = useState(() => initial?.tasks || makeStarterTasks());
  const [profile, setProfile] = useState(() => initial?.profile || { name: 'Learner', dailyGoal: 90, focusSkill: 'React' });
  const [activePage, setActivePage] = useState('Overview');
  const [activeFilter, setActiveFilter] = useState('All tasks');
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All skills');
  const [sortBy, setSortBy] = useState('priority');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ title: '', skill: 'React', priority: 'Medium', dueDate: dayOffset(0), minutes: 30, notes: '' });
  const titleRef = useRef(null);
  const [exportNote, setExportNote] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, profile })); } catch { /* browser storage may be unavailable */ }
  }, [tasks, profile]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => { if (modalOpen) setTimeout(() => titleRef.current?.focus(), 40); }, [modalOpen]);

  const today = dayOffset(0);
  const completed = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);
  const todayTasks = tasks.filter((t) => t.dueDate === today && !t.completed);
  const completedToday = completed.filter((t) => t.completedAt && localISO(t.completedAt) === today).length;
  const totalMinutes = activeTasks.reduce((sum, t) => sum + (Number(t.minutes) || 0), 0);
  const plannedToday = todayTasks.reduce((sum, t) => sum + (Number(t.minutes) || 0), 0);
  const donePercent = tasks.length ? Math.round(completed.length / tasks.length * 100) : 0;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const completedThisWeek = completed.filter((t) => t.completedAt && new Date(t.completedAt) >= weekStart).length;

  const skillStats = useMemo(() => SKILLS.map((skill) => {
    const items = tasks.filter((t) => t.skill === skill.name);
    const done = items.filter((t) => t.completed).length;
    return { ...skill, total: items.length, done, percent: items.length ? Math.round(done / items.length * 100) : 0 };
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    let list = [...tasks];
    if (activeFilter === 'Today') list = list.filter((t) => t.dueDate === today && !t.completed);
    else if (activeFilter === 'Upcoming') list = list.filter((t) => t.dueDate > today && !t.completed);
    else if (activeFilter === 'Completed') list = list.filter((t) => t.completed);
    else if (activeFilter === 'Overdue') list = list.filter(isOverdue);
    else if (activeFilter === 'All tasks') list = list.filter((t) => !t.completed);
    if (skillFilter !== 'All skills') list = list.filter((t) => t.skill === skillFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((t) => `${t.title} ${t.skill} ${t.notes} ${t.priority}`.toLowerCase().includes(q));
    if (sortBy === 'priority') list.sort((a, b) => Number(a.completed) - Number(b.completed) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    else if (sortBy === 'due') list.sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    else if (sortBy === 'created') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [tasks, activeFilter, skillFilter, search, sortBy, today]);

  const openAddModal = (skill = null) => {
    setEditingTask(null);
    setForm({ title: '', skill: skill || profile.focusSkill || 'React', priority: 'Medium', dueDate: dayOffset(0), minutes: 30, notes: '' });
    setModalOpen(true);
  };
  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, skill: task.skill, priority: task.priority, dueDate: task.dueDate || '', minutes: task.minutes, notes: task.notes || '' });
    setModalOpen(true);
  };
  const saveTask = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) { setToast('Please add a task title.'); return; }
    if (title.length < 3) { setToast('Task title should be at least 3 characters.'); return; }
    const payload = { ...form, title, minutes: Math.max(5, Math.min(480, Number(form.minutes) || 30)), notes: form.notes.trim() };
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...payload } : t));
      setToast('Task updated successfully');
    } else {
      const newTask = { ...payload, id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, completed: false, createdAt: new Date().toISOString(), completedAt: null };
      setTasks((prev) => [newTask, ...prev]);
      setActivePage('Tasks'); setActiveFilter('All tasks'); setSkillFilter('All skills'); setToast('Task added to your learning plan');
    }
    setModalOpen(false); setEditingTask(null);
  };
  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t));
    const task = tasks.find((t) => t.id === id);
    if (task) setToast(task.completed ? 'Task moved back to your list' : 'Nice work — task completed!');
  };
  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToast('Task deleted');
  };
  const changePage = (page) => {
    setActivePage(page);
    if (page === 'Tasks') { setActiveFilter('All tasks'); setSkillFilter('All skills'); }
  };
  const chooseSkill = (skill) => { setSkillFilter(skill); setActiveFilter('All tasks'); setActivePage('Tasks'); };
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), profile, tasks }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'skillpilot-learning-plan.json'; link.click(); URL.revokeObjectURL(url);
    setToast('Your learning plan has been exported');
  };
  const resetData = () => {
    if (!window.confirm('Reset all tasks and restore the demo learning plan? This cannot be undone.')) return;
    setTasks(makeStarterTasks()); setProfile({ name: 'Learner', dailyGoal: 90, focusSkill: 'React' }); setActivePage('Overview'); setActiveFilter('All tasks'); setSkillFilter('All skills'); setToast('Demo learning plan restored');
  };

  const pageTitle = activePage === 'Overview' ? 'Overview' : activePage === 'Tasks' ? 'My learning tasks' : activePage === 'Skills' ? 'Skill paths' : 'Settings';
  const pageSubtitle = activePage === 'Overview' ? `A little progress every day adds up. Here’s your learning pulse for ${dateLabel(today)}.` : activePage === 'Tasks' ? 'Organize your learning into small, achievable steps.' : activePage === 'Skills' ? 'See where you are making progress and choose what to practice next.' : 'Make SkillPilot work the way you like to learn.';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="spark" size={23} /></div>
          <div><div className="brand-name">skillpilot<span>.</span></div><div className="brand-caption">LEARNING WORKSPACE</div></div>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">{(profile.name || 'L').slice(0, 1).toUpperCase()}</div><div className="workspace-label"><strong>{profile.name || 'Learner'}’s space</strong><span>Personal workspace</span></div><span className="switch-chevron">⌄</span></div>
        <div className="side-section-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          <button className={`nav-item ${activePage === 'Overview' ? 'active' : ''}`} onClick={() => changePage('Overview')}><Icon name="grid"/><span>Overview</span><span className="nav-active-dot"/></button>
          <button className={`nav-item ${activePage === 'Tasks' ? 'active' : ''}`} onClick={() => changePage('Tasks')}><Icon name="checklist"/><span>My tasks</span><span className="nav-count">{activeTasks.length}</span></button>
          <button className={`nav-item ${activePage === 'Skills' ? 'active' : ''}`} onClick={() => changePage('Skills')}><Icon name="route"/><span>Skill paths</span></button>
        </nav>
        <div className="side-section-label skill-label">YOUR SKILLS <button title="Add a task" onClick={() => openAddModal()}><Icon name="plus" size={14}/></button></div>
        <div className="skill-nav-list">
          {SKILLS.slice(0, 5).map((skill) => <button key={skill.name} className={`skill-nav-item ${skillFilter === skill.name && activePage === 'Tasks' ? 'selected' : ''}`} onClick={() => chooseSkill(skill.name)}><span className={`skill-mini-icon ${skill.tone}`}>{skill.icon}</span><span>{skill.name}</span><span className="skill-nav-number">{tasks.filter((t) => t.skill === skill.name && !t.completed).length}</span></button>)}
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-glow"/><div className="upgrade-icon"><Icon name="spark" size={17}/></div><strong>Small steps.<br/>Big outcomes.</strong><p>Stay consistent and let your skills compound.</p><button onClick={() => changePage('Skills')}>View skill paths <Icon name="arrow" size={14}/></button></div>
          <button className={`nav-item settings-nav ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => changePage('Settings')}><Icon name="settings"/><span>Settings</span></button>
          <div className="sidebar-footer"><span className="online-dot"/> All progress saved locally</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Icon name="search" size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks"/><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" title="Notifications" onClick={() => setToast(todayTasks.length ? `You have ${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'} due today` : 'You are all clear for today!')}><Icon name="bell"/><span className={todayTasks.length ? 'notification-dot' : 'notification-dot hidden'}/></button>
            <button className="profile-chip" onClick={() => changePage('Settings')} title="Open settings"><span className="profile-avatar">{(profile.name || 'L').slice(0, 1).toUpperCase()}</span><span className="profile-name">{profile.name || 'Learner'}</span><span className="profile-chevron">⌄</span></button>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR LEARNING, IN FOCUS</div><h1>{pageTitle === 'Overview' ? <>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {profile.name || 'Learner'} <span className="wave">✳</span></> : pageTitle}</h1><p className="page-subtitle">{pageSubtitle}</p></div>{activePage !== 'Settings' && <button className="primary-button" onClick={() => openAddModal()}><Icon name="plus" size={17}/> New task</button>}</div>

          {activePage === 'Overview' && <>
            <section className="hero-panel">
              <div className="hero-copy"><div className="hero-kicker"><span className="hero-spark">✦</span> YOUR WEEKLY MOMENTUM</div><h2>Build the skills.<br/><span>Become the person.</span></h2><p>Every task you finish is one step closer to your next big milestone.</p><button className="hero-button" onClick={() => { changePage('Tasks'); setActiveFilter('Today'); }}>Focus on today <Icon name="arrow" size={16}/></button></div>
              <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orbit-core"><Icon name="spark" size={38}/></div><div className="orbit-node node-one">⚛</div><div className="orbit-node node-two">Py</div><div className="orbit-node node-three">SQL</div><div className="orbit-node node-four">✓</div></div>
              <div className="hero-foot"><span><span className="hero-foot-dot"/> CONSISTENCY OVER INTENSITY</span><span>{completedThisWeek} tasks completed this week</span></div>
            </section>

            <section className="stats-grid" aria-label="Learning statistics">
              <div className="stat-card"><div className="stat-top"><span className="stat-icon purple"><Icon name="checklist"/></span><span className="stat-trend positive">↗ {donePercent}%</span></div><div className="stat-number">{activeTasks.length}<span className="stat-unit"> tasks</span></div><div className="stat-label">Tasks in progress</div><div className="stat-bottom"><span className="tiny-track"><i style={{ width: `${donePercent}%` }}/></span><span>{completed.length} completed total</span></div></div>
              <div className="stat-card"><div className="stat-top"><span className="stat-icon cyan"><Icon name="calendar"/></span><span className="stat-soft">TODAY</span></div><div className="stat-number">{todayTasks.length}<span className="stat-unit"> tasks</span></div><div className="stat-label">On today’s plan</div><div className="stat-bottom"><span className="stat-note"><Icon name="clock" size={13}/> {plannedToday} min planned</span></div></div>
              <div className="stat-card"><div className="stat-top"><span className="stat-icon green"><Icon name="flame"/></span><span className="stat-soft">LAST 7 DAYS</span></div><div className="stat-number">{completedThisWeek}<span className="stat-unit"> tasks</span></div><div className="stat-label">Completed this week</div><div className="stat-bottom"><span className="stat-note">Keep your momentum going</span></div></div>
              <div className="stat-card"><div className="stat-top"><span className="stat-icon orange"><Icon name="clock"/></span><span className="stat-soft">ESTIMATE</span></div><div className="stat-number">{Math.floor(totalMinutes / 60)}<span className="stat-unit">h</span> {totalMinutes % 60}<span className="stat-unit">m</span></div><div className="stat-label">Learning time remaining</div><div className="stat-bottom"><span className="stat-note">Across all open tasks</span></div></div>
            </section>

            <div className="content-grid">
              <section className="panel tasks-panel"><div className="panel-heading"><div><h3>Today’s focus</h3><p>The next small win is waiting for you.</p></div><button className="text-action" onClick={() => { changePage('Tasks'); setActiveFilter('Today'); }}>View all <Icon name="arrow" size={14}/></button></div>
                <div className="today-date"><span className="date-square"><strong>{new Date().toLocaleDateString('en-US', { day: '2-digit' })}</strong><small>{new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small></span><div><strong>{dateLabel(today)}</strong><span>{todayTasks.length ? `${todayTasks.length} tasks left to complete` : 'Your schedule is clear — add a learning task!'}</span></div><span className="today-progress">{tasks.filter((t) => t.dueDate === today && t.completed).length}/{tasks.filter((t) => t.dueDate === today).length} done</span></div>
                <div className="task-list compact-list">{tasks.filter((t) => t.dueDate === today).sort((a,b) => Number(a.completed)-Number(b.completed) || PRIORITY_RANK[a.priority]-PRIORITY_RANK[b.priority]).slice(0, 4).map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={openEditModal} onDelete={deleteTask}/>)}</div>
                {tasks.filter((t) => t.dueDate === today).length === 0 && <EmptyState title="Nothing planned for today" copy="Add a small task to keep your learning momentum." action="Add a task" onAction={() => openAddModal()}/>}
                <button className="add-inline" onClick={() => openAddModal()}><span><Icon name="plus" size={16}/></span> Add a task for today</button>
              </section>

              <section className="panel skill-progress-panel"><div className="panel-heading"><div><h3>Skill progress</h3><p>Learn a little. Level up a lot.</p></div><button className="icon-button subtle-icon" title="View skill paths" onClick={() => changePage('Skills')}><Icon name="arrow" size={16}/></button></div>
                <div className="skill-overall"><div className="progress-ring" style={{ '--progress': `${donePercent}%` }}><div><strong>{donePercent}%</strong><small>overall</small></div></div><div className="skill-overall-copy"><strong>{completed.length} of {tasks.length} tasks</strong><span>across your learning paths</span><span className="mini-positive">{donePercent >= 70 ? 'Great momentum!' : 'Every step counts ✦'}</span></div></div>
                <div className="skill-bars">{skillStats.filter((s) => s.total > 0).slice(0, 4).map((s) => <button className="skill-bar-row" key={s.name} onClick={() => chooseSkill(s.name)}><span className={`skill-mini-icon ${s.tone}`}>{s.icon}</span><span className="skill-bar-name">{s.name}</span><span className="bar-track"><i style={{ width: `${s.percent}%` }}/></span><strong>{s.percent}%</strong></button>)}</div>
                <button className="panel-footer-link" onClick={() => changePage('Skills')}>Explore all skill paths <Icon name="arrow" size={14}/></button>
              </section>
            </div>

            <section className="panel upcoming-panel"><div className="panel-heading"><div><h3>Coming up next</h3><p>Keep an eye on what’s around the corner.</p></div><button className="text-action" onClick={() => { changePage('Tasks'); setActiveFilter('Upcoming'); }}>See schedule <Icon name="arrow" size={14}/></button></div><div className="upcoming-grid">{tasks.filter((t) => !t.completed && t.dueDate > today).sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3).map((task) => <button key={task.id} className="upcoming-card" onClick={() => openEditModal(task)}><span className={`upcoming-skill-mark ${skillMeta(task.skill).tone}`}>{skillMeta(task.skill).icon}</span><span className="upcoming-main"><strong>{task.title}</strong><small>{task.skill} · {task.minutes} min</small></span><span className="upcoming-date"><Icon name="calendar" size={13}/>{formatShortDate(task.dueDate)}</span></button>)}{tasks.filter((t) => !t.completed && t.dueDate > today).length === 0 && <div className="upcoming-empty">No upcoming tasks yet. You can plan your next learning session any time.</div>}</div></section>
          </>}

          {activePage === 'Tasks' && <section className="panel all-tasks-panel"><div className="task-toolbar"><div className="filter-tabs">{['All tasks', 'Today', 'Upcoming', 'Overdue', 'Completed'].map((filter) => <button key={filter} className={activeFilter === filter ? 'selected' : ''} onClick={() => setActiveFilter(filter)}>{filter}{filter === 'Today' && <span>{todayTasks.length}</span>}</button>)}</div><div className="toolbar-selects"><select aria-label="Filter by skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}><option>All skills</option>{SKILLS.map((s) => <option key={s.name}>{s.name}</option>)}</select><select aria-label="Sort tasks" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="priority">Sort: Priority</option><option value="due">Sort: Due date</option><option value="created">Sort: Recently added</option></select></div></div>
            <div className="task-results-line"><span>Showing <strong>{visibleTasks.length}</strong> {visibleTasks.length === 1 ? 'task' : 'tasks'}{skillFilter !== 'All skills' ? ` in ${skillFilter}` : ''}</span><button onClick={() => { setSearch(''); setSkillFilter('All skills'); setActiveFilter('All tasks'); setSortBy('priority'); }}>Reset filters</button></div>
            {visibleTasks.length ? <div className="task-list full-task-list">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={openEditModal} onDelete={deleteTask} detailed/> )}</div> : <EmptyState title={search ? 'No matching tasks' : activeFilter === 'Completed' ? 'Your next win starts here' : 'Nothing on this list yet'} copy={search ? 'Try a different keyword or clear your filters.' : 'Add a learning task and turn your goal into action.'} action="Create a task" onAction={() => openAddModal()}/>}</section>}

          {activePage === 'Skills' && <div className="skills-page"><section className="skills-intro panel"><div className="skills-intro-icon"><Icon name="route" size={26}/></div><div><h2>Your path to progress</h2><p>Each skill path collects the small actions that help you improve. Add tasks to build consistency and see your completion rate grow.</p></div><button className="primary-button" onClick={() => openAddModal(profile.focusSkill)}><Icon name="plus" size={16}/> Add skill task</button></section><div className="skill-path-grid">{skillStats.map((skill) => <article className="skill-path-card" key={skill.name}><div className="skill-card-top"><span className={`skill-big-icon ${skill.tone}`}>{skill.icon}</span><button className="skill-add-button" title={`Add ${skill.name} task`} onClick={() => openAddModal(skill.name)}><Icon name="plus" size={17}/></button></div><h3>{skill.name}</h3><p>{skill.description}</p><div className="path-progress-label"><span>{skill.done} of {skill.total} tasks complete</span><strong>{skill.percent}%</strong></div><div className="path-track"><i className={skill.tone} style={{ width: `${skill.percent}%` }}/></div><div className="skill-card-bottom"><span><Icon name="clock" size={14}/> {tasks.filter((t) => t.skill === skill.name && !t.completed).reduce((sum, t) => sum + Number(t.minutes || 0), 0)} min left</span><button onClick={() => chooseSkill(skill.name)}>View tasks <Icon name="arrow" size={13}/></button></div></article>)}</div></div>}

          {activePage === 'Settings' && <div className="settings-layout"><section className="panel settings-panel"><div className="settings-section-heading"><span className="settings-heading-icon"><Icon name="grid"/></span><div><h3>Personal preferences</h3><p>Customize your learning workspace.</p></div></div><form className="settings-form" onSubmit={(e) => { e.preventDefault(); setToast('Preferences saved'); }}><label>What should we call you?<input value={profile.name} maxLength={32} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your name"/></label><label>Daily learning goal<select value={profile.dailyGoal} onChange={(e) => setProfile((p) => ({ ...p, dailyGoal: Number(e.target.value) }))}><option value={30}>30 minutes a day</option><option value={60}>1 hour a day</option><option value={90}>1.5 hours a day</option><option value={120}>2 hours a day</option><option value={180}>3 hours a day</option></select></label><label>Focus skill<select value={profile.focusSkill} onChange={(e) => setProfile((p) => ({ ...p, focusSkill: e.target.value }))}>{SKILLS.map((s) => <option key={s.name}>{s.name}</option>)}</select></label><button className="primary-button" type="submit">Save preferences <Icon name="check" size={15}/></button></form></section><section className="panel settings-panel"><div className="settings-section-heading"><span className="settings-heading-icon"><Icon name="download"/></span><div><h3>Your data</h3><p>Your tasks stay in this browser using LocalStorage.</p></div></div><div className="data-action-row"><div><strong>Export learning plan</strong><p>Download your tasks and preferences as a JSON file.</p></div><button className="secondary-button" onClick={exportData}><Icon name="download" size={15}/> Export JSON</button></div><div className="data-action-row danger-row"><div><strong>Restore demo data</strong><p>Remove your changes and return to the starter tasks.</p></div><button className="danger-button" onClick={resetData}><Icon name="trash" size={15}/> Reset data</button></div><div className="storage-note"><span className="online-dot"/> <div><strong>Local-first by design</strong><p>No account or backend required. Clearing browser storage may remove your saved plan, so export a backup when needed.</p></div></div></section></div>}

          <footer className="page-footer"><span>Made for the curious mind <span className="footer-heart">✦</span></span><span>SKILLPILOT TASKS <i/> LEARN SOMETHING EVERY DAY</span></footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><div className="modal-kicker"><Icon name="spark" size={14}/> LEARNING TASK</div><h2 id="modal-title">{editingTask ? 'Edit task' : 'Create a new task'}</h2><p>Small, focused actions build lasting skills.</p></div><button className="icon-button modal-close" onClick={() => setModalOpen(false)} aria-label="Close"><Icon name="close"/></button></div><form onSubmit={saveTask} className="task-form"><label className="wide-field">Task title <span className="required-star">*</span><input ref={titleRef} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Build a React form with validation" maxLength={100} required/><small>Be specific about what you want to accomplish.</small></label><div className="form-two-col"><label>Skill area<select value={form.skill} onChange={(e) => setForm((f) => ({ ...f, skill: e.target.value }))}>{SKILLS.map((s) => <option key={s.name}>{s.name}</option>)}</select></label><label>Priority<select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}><option>High</option><option>Medium</option><option>Low</option></select></label><label>Due date<input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}/></label><label>Estimated time<select value={form.minutes} onChange={(e) => setForm((f) => ({ ...f, minutes: Number(e.target.value) }))}><option value={15}>15 minutes</option><option value={20}>20 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>1 hour</option><option value={90}>1.5 hours</option><option value={120}>2 hours</option></select></label></div><label className="wide-field">Notes <span className="optional-label">OPTIONAL</span><textarea rows="3" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Add a resource, reminder, or definition of done..." maxLength={500}/></label><div className="form-footer"><span><Icon name="check" size={15}/> Saved to this browser automatically</span><div><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button"><Icon name={editingTask ? 'check' : 'plus'} size={16}/>{editingTask ? 'Save changes' : 'Create task'}</button></div></div></form></section></div>}
      {toast && <div className="toast-message" role="status"><span className="toast-check"><Icon name="check" size={15}/></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><Icon name="close" size={14}/></button></div>}
    </div>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete, detailed = false }) {
  const meta = skillMeta(task.skill);
  return <article className={`task-row ${task.completed ? 'task-completed' : ''} ${detailed ? 'task-row-detailed' : ''}`}>
    <button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}>{task.completed && <Icon name="check" size={14}/>}</button>
    <div className="task-row-main"><button className="task-title-button" onClick={() => onEdit(task)}>{task.title}</button>{detailed && task.notes && <p className="task-notes">{task.notes}</p>}<div className="task-row-meta"><span className={`skill-tag ${meta.tone}`}><span>{meta.icon}</span>{task.skill}</span><span className={`priority-tag priority-${task.priority.toLowerCase()}`}><i/>{task.priority}</span>{detailed && <span className="task-duration"><Icon name="clock" size={13}/>{task.minutes} min</span>}{isOverdue(task) && <span className="overdue-tag">Overdue</span>}</div></div>
    <div className="task-row-end"><span className={`task-due ${isOverdue(task) ? 'is-overdue' : ''} ${task.dueDate === dayOffset(0) && !task.completed ? 'is-today' : ''}`}><Icon name="calendar" size={13}/>{formatShortDate(task.dueDate)}</span><div className="task-actions"><button title="Edit task" aria-label="Edit task" onClick={() => onEdit(task)}><Icon name="edit" size={14}/></button><button title="Delete task" aria-label="Delete task" onClick={() => onDelete(task.id)}><Icon name="trash" size={14}/></button></div></div>
  </article>;
}
function EmptyState({ title, copy, action, onAction }) {
  return <div className="empty-state"><div className="empty-illustration"><Icon name="spark" size={28}/></div><h3>{title}</h3><p>{copy}</p>{action && <button className="secondary-button" onClick={onAction}><Icon name="plus" size={15}/>{action}</button>}</div>;
}
