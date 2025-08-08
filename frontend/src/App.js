import { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // Colored syntax theme

const USER = {
  name: 'Demo User',
  username: 'demo_user',
  email: 'demo@example.com',
  bio: 'Full-stack developer passionate about clean code and modern web technologies.',
  avatar: 'https://wallpapercave.com/wp/wp1869641.jpg'
};

function SnippetCard({ snippet, onSelect }) {
  const [activeTab, setActiveTab] = useState('html');
  const jsCode = snippet.js || '';
  const codeToCopy =
    activeTab === 'html' ? snippet.html || ''
      : activeTab === 'css' ? snippet.css || ''
      : jsCode;

  const languageMap = {
    html: languages.html,
    css: languages.css,
    javascript: languages.javascript
  };

  return (
    <div
      onClick={() => onSelect(snippet)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(snippet); }}
      className="cursor-pointer bg-white dark:bg-gray-900 border rounded-lg overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow p-4"
    >
      <h3 className="text-xl font-bold mb-1 text-blue-700 dark:text-blue-300">{snippet.title}</h3>
      <small className="mb-3 text-gray-500 dark:text-gray-400 select-none">By {snippet.author || 'anonymous'}</small>

      <div className="flex space-x-2 mb-3 select-none">
        {['html', 'css', 'javascript'].map(tab => (
          <button
            onClick={e => { e.stopPropagation(); setActiveTab(tab); }}
            key={tab}
            className={`px-3 py-1 rounded-t text-xs font-semibold ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 dark:text-gray-300 text-gray-600 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <pre
        className="overflow-auto max-h-40 rounded bg-gray-50 dark:bg-gray-900 p-3 font-mono text-sm text-black dark:text-white"
        dangerouslySetInnerHTML={{ __html: highlight(codeToCopy, languageMap[activeTab], activeTab) }}
        style={{ whiteSpace: 'pre-wrap' }}
      />

      <button
        onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(codeToCopy); alert(`Copied ${activeTab.toUpperCase()} code!`); }}
        className="mt-3 self-end bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 text-sm"
      >
        Copy {activeTab.toUpperCase()}
      </button>
    </div>
  );
}

function SnippetDetailView({ snippet, onBack }) {
  const [activeTab, setActiveTab] = useState('html');
  const code = activeTab === 'html' ? snippet.html : activeTab === 'css' ? snippet.css : (snippet.js || '');

  const languageMap = {
    html: languages.html,
    css: languages.css,
    javascript: languages.javascript,
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        &larr; Back
      </button>

      <h2 className="text-3xl font-bold mb-2">{snippet.title}</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">By {snippet.author || 'anonymous'}</p>

      <div className="flex space-x-3 mb-4">
        {['html', 'css', 'javascript'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-gray-200'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="border rounded bg-gray-100 dark:bg-neutral-900 p-4 overflow-auto max-h-96 mb-4 font-mono text-sm whitespace-pre-wrap text-black dark:text-white">
        <pre
          className={`language-${activeTab}`}
          dangerouslySetInnerHTML={{ __html: highlight(code ?? '', languageMap[activeTab], activeTab) }}
        />
      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(code ?? '');
          alert(`Copied ${activeTab.toUpperCase()} code!`);
        }}
        className="mb-8 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Copy {activeTab.toUpperCase()}
      </button>

      <h3 className="text-xl font-semibold mb-3">Live Preview</h3>
      <div className="border rounded bg-white dark:bg-neutral-800 p-4 max-h-64 overflow-auto" style={{ minHeight: 150 }}>
        <div dangerouslySetInnerHTML={{ __html: snippet.html ?? '<em>No HTML content</em>' }} />
        <style>{snippet.css ?? ''}</style>
        <script dangerouslySetInnerHTML={{ __html: snippet.js ?? '' }} />
      </div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [snippets, setSnippets] = useState([]);
  const [form, setForm] = useState({ title: '', html: '', css: '', js: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const filteredSnippets = snippets.filter(snippet => {
    const lang = (snippet.language || '').toLowerCase();
    const matchesLanguage = languageFilter === 'all' || lang === languageFilter;
    const content = (
      (snippet.title || '') + ' ' +
      (snippet.html || '') + ' ' +
      (snippet.css || '') + ' ' +
      (snippet.js || '')
    ).toLowerCase();
    return matchesLanguage && content.includes(searchTerm.toLowerCase());
  });

  const userSnippets = snippets.filter(s => s.author === USER.username);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/snippets')
      .then(res => setSnippets(res.data))
      .catch(() => setSnippets([]));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, author: USER.username, language: 'javascript' };
      const res = await axios.post('http://localhost:5000/api/snippets', payload);
      setSnippets([res.data, ...snippets]);
      setForm({ title: '', html: '', css: '', js: '' });
      setActivePage('home');
    } catch {
      alert('Failed to submit snippet.');
    }
  };

  // Placeholders
  const htmlPlaceholder = `<button>Click Me</button>`;
  const cssPlaceholder = `button { background: #3498db; }`;
  const jsPlaceholder = `console.log('Hello World');`;

  const navLinkStyle = tab =>
    `px-4 py-2 font-semibold rounded-t transition-colors duration-300 ${
      activePage === tab
        ? 'bg-blue-500 text-white shadow-md'
        : 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-neutral-900 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300'
    }`;

  const renderPage = () => {
    if (selectedSnippet) {
      return <SnippetDetailView snippet={selectedSnippet} onBack={() => setSelectedSnippet(null)} />;
    }
    if (activePage === 'home') {
      return (
        <div className="py-6 flex flex-col items-center max-w-6xl mx-auto px-4">
          <section className="mb-8 w-full text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-blue-600 dark:text-blue-300">
              Discover &amp; Share Code Snippets
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2 max-w-xl mx-auto">
              Find reusable code snippets for your projects or share your own creations with the community.
            </p>
          </section>

          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full max-w-3xl justify-center mb-8">
            <input
              type="text"
              className="p-2 text-base border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 transition font-sans w-full md:w-[520px]"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 pl-3 pr-6 text-base border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none relative dark:bg-gray-800 dark:text-gray-200 w-full md:w-44"
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg fill='none' stroke='%23666' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e")`,

                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
              }}
            >
              <option value="all">All Languages</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300 w-full text-center">
            Community Snippets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredSnippets.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-400 col-span-full text-center">
                No snippets found.
              </div>
            ) : (
              filteredSnippets.map(snippet => (
                <SnippetCard key={snippet._id || snippet.id} snippet={snippet} onSelect={setSelectedSnippet} />
              ))
            )}
          </div>
        </div>
      );
    }
    if (activePage === 'create') {
      return (
        <div className="flex flex-col md:flex-row gap-8 py-6 w-full max-w-5xl px-4 mx-auto">
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 p-6 bg-gray-50 dark:bg-gray-900 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">Create New Snippet</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 font-medium text-gray-900 dark:text-white">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
                placeholder="e.g. Responsive Card Component"
                required
                autoFocus
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-2 font-medium text-gray-900 dark:text-white">HTML Code</label>
              {form.html.trim() === '' && (
                <pre className="absolute z-10 text-gray-400 pointer-events-none px-3 py-2 select-none"
                  style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 14, opacity: 0.7 }}>
                  {htmlPlaceholder}
                </pre>
              )}
              <CodeEditor
                value={form.html}
                onValueChange={code => setForm({ ...form, html: code })}
                highlight={code => highlight(code, languages.html, 'html')}
                padding={10}
                className="border rounded-md font-mono dark:bg-gray-800 dark:text-gray-200"
                style={{ minHeight: 150, fontSize: 14 }}
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-2 font-medium text-gray-900 dark:text-white">CSS Code</label>
              {form.css.trim() === '' && (
                <pre className="absolute z-10 text-gray-400 pointer-events-none px-3 py-2 select-none"
                  style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 14, opacity: 0.7 }}>
                  {cssPlaceholder}
                </pre>
              )}
              <CodeEditor
                value={form.css}
                onValueChange={code => setForm({ ...form, css: code })}
                highlight={code => highlight(code, languages.css, 'css')}
                padding={10}
                className="border rounded-md font-mono dark:bg-gray-800 dark:text-gray-200"
                style={{ minHeight: 150, fontSize: 14 }}
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-2 font-medium text-gray-900 dark:text-white">JavaScript Code</label>
              {form.js.trim() === '' && (
                <pre className="absolute z-10 text-gray-400 pointer-events-none px-3 py-2 select-none"
                  style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 14, opacity: 0.7 }}>
                  {jsPlaceholder}
                </pre>
              )}
              <CodeEditor
                value={form.js}
                onValueChange={code => setForm({ ...form, js: code })}
                highlight={code => highlight(code, languages.javascript, 'js')}
                padding={10}
                className="border rounded-md font-mono dark:bg-gray-800 dark:text-gray-200"
                style={{ minHeight: 150, fontSize: 14 }}
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
              Share Snippet
            </button>
          </form>

          <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900 border rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
            <h3 className="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-300 text-center">{form.title || 'Snippet Preview'}</h3>
            <div className="border rounded bg-white dark:bg-gray-900 p-4 mb-3 flex justify-center items-center" style={{ minHeight: 150 }}>
              <div dangerouslySetInnerHTML={{ __html: form.html || "<div style='color:#bdbdbd'>Type HTML to preview</div>" }} />
              <style>{form.css || ''}</style>
              <script dangerouslySetInnerHTML={{ __html: form.js || '' }} />
            </div>
          </div>
        </div>
      );
    }
    if (activePage === 'profile') {
      return (
        <div className="py-8 flex flex-col items-center">
          <img src={USER.avatar} alt="User avatar" className="rounded-full mb-3 w-24 h-24 border-4 border-blue-400 shadow" />
          <h2 className="mb-2 text-2xl font-bold text-blue-800 dark:text-blue-300">{USER.name}</h2>
          <div className="mb-1 font-mono text-sm text-gray-700 dark:text-gray-300">@{USER.username}</div>
          <div className="mb-2 font-mono text-sm text-blue-600 dark:text-blue-300">{USER.email}</div>
          <p className="mb-4 max-w-lg text-center text-gray-700 dark:text-gray-400">{USER.bio}</p>
          <div className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-full font-semibold shadow text-lg">
            My Snippets: {userSnippets.length}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-tr ${theme === 'dark' ? 'from-black to-gray-900' : 'from-blue-50 to-blue-100'} transition-colors duration-500`}>
      <nav className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow flex justify-between items-center px-8 py-3">
        <div className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-300 select-none">
          Code<span className="text-blue-400">Snippet HUB</span>
        </div>
        <div className="flex items-center space-x-4">
          {['home', 'create', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActivePage(tab); setSelectedSnippet(null); }}
              className={navLinkStyle(tab)}
              aria-current={activePage === tab ? 'page' : undefined}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle Theme"
            className="ml-4 border rounded-full p-1 transition hover:bg-blue-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? (
              // Moon icon on light mode
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-7 h-7 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"></path>
              </svg>
            ) : (
              // Yellow Sun icon on dark mode
              <svg xmlns="http://www.w3.org/2000/svg" fill="#FACC15" stroke="#FACC15" strokeWidth="1.5" viewBox="0 0 24 24" className="w-7 h-7">
                <circle cx="12" cy="12" r="5"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
