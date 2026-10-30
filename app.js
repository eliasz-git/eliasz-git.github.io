/* tundra-node terminal logic
   Dependency-free CLI: input buffer, history, ANSI-style output, commands.
   Data lives in data.js (SITE_DATA). */

(function () {
  'use strict';

  const body = document.getElementById('term-body');
  const input = document.getElementById('term-input');
  const promptEl = document.getElementById('term-prompt');

  if (!body || !input || !promptEl) return;

  const D = SITE_DATA;

  // ---------- state ----------
  let history = [];
  let hIndex = history.length;
  let cwd = ['~'];
  let commandCount = 0;

  // ---------- helpers ----------
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function print(html, className) {
    const div = document.createElement('div');
    div.className = 'out ' + (className || '');
    div.innerHTML = html;
    body.appendChild(div);
    scrollBottom();
    return div;
  }

  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function setPrompt() {
    promptEl.textContent = D.handle + '@' + D.host + ':' + cwd.join('/') + '$';
  }

  function focusInput() {
    input.focus();
  }

  // ---------- command registry ----------
  const COMMANDS = {};

  COMMANDS.help = function () {
    let out = '<span class="hdr">available commands</span>\n';
    const rows = [
      ['help', 'show this help message'],
      ['about', 'bio and system information'],
      ['projects', 'list projects'],
      ['contact', 'contact information'],
      ['clear', 'clear the terminal screen'],
      ['whoami', 'current user'],
      ['pwd', 'print working directory'],
      ['ls', 'list directory contents'],
      ['neofetch', 'show system information'],
      ['date', 'current date and time'],
      ['echo <text>', 'echo text back'],
      ['history', 'show command history'],
      ['sudo <cmd>', 'run a command with super-user privileges (for fun)'],
      ['exit', 'do nothing (you are already here)']
    ];
    rows.forEach(([cmd, desc]) => {
      out += '  <span class="cmd">' + esc(cmd) + '</span>' +
             ' '.repeat(Math.max(2, 22 - esc(cmd).length)) +
             esc(desc) + '\n';
    });
    out += '\n<span class="hint">tip: click any nav link to run that command.</span>';
    return out;
  };

  COMMANDS.about = function () {
    let out = '<span class="hdr">about ' + esc(D.name) + '</span>\n';
    out += esc(D.bio) + '\n\n';
    out += '  status: <span class="ok">' + esc(D.status) + '</span>\n';
    out += '  description: ' + esc(D.description) + '\n';
    out += '  site: <a href="' + esc(D.url) + '" target="_blank" rel="noopener">' + esc(D.url) + '</a>\n';
    out += '\n<span class="hint">use `projects` to see what I\'ve built, or `contact` to reach me.</span>';
    return out;
  };

  COMMANDS.projects = function () {
    let out = '<span class="hdr">projects</span>\n';
    D.projects.forEach((p) => {
      out += '\n';
      out += '  <span class="proj">\n';
      out += '    <span class="name">' + esc(p.title) + '</span>';
      if (p.status === 'active') out += ' <span class="status active">active</span>';
      if (p.status === 'wip') out += ' <span class="status wip">wip</span>';
      out += '\n    <span class="desc">' + esc(p.desc) + '</span>\n';
      out += '    <span class="meta">stack: ' + esc(p.stack.join(', ')) + '</span>\n';
      if (p.repo) out += '    <span class="meta">repo: <a href="' + esc(p.repo) + '" target="_blank" rel="noopener">' + esc(p.repo) + '</a></span>\n';
      if (p.url) out += '    <span class="meta">live: <a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.url) + '</a></span>\n';
      out += '  </span>\n';
    });
    out += '\n<span class="hint">visit codeberg.org/eliasz for all repositories.</span>';
    return out;
  };

  COMMANDS.contact = function () {
    let out = '<span class="hdr">contact</span>\n';
    out += '  email:    <a href="mailto:' + esc(D.email) + '">' + esc(D.email) + '</a>\n';
    out += '  codeberg: <a href="' + esc(D.codeberg) + '" target="_blank" rel="noopener">' + esc(D.codeberg) + '</a>\n';
    out += '  linkedin: <a href="' + esc(D.linkedin) + '" target="_blank" rel="noopener">' + esc(D.linkedin) + '</a>\n';
    out += '  site:     <a href="' + esc(D.url) + '" target="_blank" rel="noopener">' + esc(D.url) + '</a>\n';
    return out;
  };

  COMMANDS.clear = function () {
    body.innerHTML = '';
    printWelcome();
    return null;
  };

  COMMANDS.whoami = function () {
    return D.handle;
  };

  COMMANDS.pwd = function () {
    return '/' + cwd.join('/');
  };

  COMMANDS.ls = function () {
    let out = '<span class="hdr">contents of ' + ('/' + cwd.join('/')) + '</span>\n';
    const items = [
      { name: 'about/', type: 'dir' },
      { name: 'projects/', type: 'dir' },
      { name: 'contact/', type: 'dir' },
      { name: 'data.js', type: 'file' },
      { name: 'app.js', type: 'file' },
      { name: 'style.css', type: 'file' },
      { name: 'index.html', type: 'file' },
      { name: 'README.md', type: 'file' },
      { name: '.nojekyll', type: 'file' }
    ];
    items.forEach((it) => {
      const color = it.type === 'dir' ? 'ansi-cyan' : 'ansi-green';
      out += '  <span class="' + color + '">' + esc(it.name) + '</span>  ';
    });
    out += '\n';
    return out;
  };

  COMMANDS.neofetch = function () {
    let out = '<span class="hdr">neofetch</span>\n\n';
    out += '  <span class="label">OS:</span>      <span class="value">' + esc(D.distro) + '</span>\n';
    out += '  <span class="label">Host:</span>      <span class="value">' + esc(D.host) + '</span>\n';
    out += '  <span class="label">Kernel:</span>    <span class="value">' + esc(D.kernel) + '</span>\n';
    out += '  <span class="label">Uptime:</span>    <span class="value">' + esc(D.uptime) + '</span>\n';
    out += '  <span class="label">Shell:</span>     <span class="value">' + esc(D.shell) + '</span>\n';
    out += '  <span class="label">Terminal:</span>  <span class="value">' + esc(D.terminal) + '</span>\n';
    out += '  <span class="label">Editor:</span>    <span class="value">' + esc(D.editor) + '</span>\n';
    out += '  <span class="label">Packages:</span>  <span class="value">' + esc(D.packages) + '</span>\n';
    out += '  <span class="label">DE:</span>        <span class="value">tundra-desktop (static)</span>\n';
    return out;
  };

  COMMANDS.date = function () {
    return new Date().toString();
  };

  COMMANDS.echo = function (arg) {
    return esc(arg);
  };

  COMMANDS.history = function () {
    if (!history.length) return '<span class="muted">no history yet.</span>';
    let out = '<span class="hdr">command history</span>\n';
    history.forEach((cmd, i) => {
      out += '  ' + String(i + 1).padStart(3) + '  ' + esc(cmd) + '\n';
    });
    return out;
  };

  COMMANDS.sudo = function (arg) {
    if (!arg) return '<span class="err">sudo: missing command</span>';
    return "<span class='warn'>[sudo] password for " + esc(D.handle) + ":</span> <span class='muted'>(typing disabled)</span>\n" +
           "<span class='err'>sudo: sorry, you must be root to run that.</span>";
  };

  COMMANDS.exit = function () {
    return '<span class="warn">you are already at the prompt. there is nowhere to exit to.</span>';
  };

  // ---------- core execution ----------
  function printWelcome() {
    print('welcome to <span class="accent">' + esc(D.host) + '</span>. type <span class="cmd">help</span> to begin.', 'ok');
    print('nav links at the top also run commands.', 'hint');
    print('', 'muted');
    setPrompt();
  }

  function run(raw) {
    const trimmed = raw.trim();
    const parts = trimmed.replace(/\s+/g, ' ').split(' ');
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    if (trimmed) {
      history.push(trimmed);
      hIndex = history.length;
    }

    const line = document.createElement('div');
    line.className = 'cmd-line';
    line.innerHTML = '<span class="cmd-prompt">' + esc(D.handle) + '@' + esc(D.host) + ':</span>' +
                     '<span class="cmd-cwd">' + esc('/' + cwd.join('/')) + '</span> ' +
                     '<span class="cmd-input">' + esc(trimmed) + '</span>';
    body.appendChild(line);

    let out = null;

    if (!cmd) {
      // empty input
    } else if (cmd in COMMANDS) {
      out = COMMANDS[cmd](arg);
    } else {
      out = '<span class="err">command not found: ' + esc(cmd) + '</span>' +
            ' <span class="hint">try `help`</span>';
    }

    if (out !== null && out !== undefined) {
      print(out, 'terminal-out');
    }

    commandCount++;
    setPrompt();
    scrollBottom();
    focusInput();
  }

  function complete() {
    const val = input.value;
    const slash = val.lastIndexOf('/');
    const hasSlash = slash !== -1;
    const partial = val.slice(slash + 1).toLowerCase();

    if (hasSlash) {
      const names = ['about', 'projects', 'contact', 'data.js', 'app.js', 'style.css', 'index.html', 'README.md', '.nojekyll'];
      const matches = names.filter((k) => k.toLowerCase().startsWith(partial));
      if (matches.length === 1) {
        input.value = val.slice(0, slash + 1) + matches[0] + ' ';
      } else if (matches.length > 1) {
        print(matches.map((n) => esc(n)).join('  '), 'terminal-out');
      }
      return;
    }

    const fsNames = ['about', 'projects', 'contact', 'data.js', 'app.js', 'style.css', 'index.html', 'README.md', '.nojekyll'];
    const matches = Object.keys(COMMANDS)
      .concat(fsNames)
      .filter((k) => k.toLowerCase().startsWith(partial));

    if (matches.length === 1) {
      input.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      print(matches.join('  '), 'terminal-out');
    }
  }

  // ---------- input handling ----------
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input.value);
      input.value = '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIndex > 0) {
        hIndex--;
        input.value = history[hIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIndex < history.length) {
        hIndex++;
        input.value = history[hIndex] || '';
      }
    }
  });

  // ---------- nav link wiring ----------
  document.querySelectorAll('a[data-cmd]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = a.getAttribute('data-cmd');
      run(cmd);
      a.classList.add('cmd-active');
      setTimeout(() => a.classList.remove('cmd-active'), 600);
      focusInput();
    });
  });

  // ---------- boot ----------
  printWelcome();
  if (!window.matchMedia('(pointer: coarse)').matches) {
    focusInput();
  }
})();
