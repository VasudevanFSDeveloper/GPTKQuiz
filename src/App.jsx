import React, { useState, useEffect, useRef, useMemo } from 'react';
import './index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


/* Formatted Date Helper */
const getTodayDateString = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

const getTodayISODate = () => {
  return new Date().toISOString().split('T')[0];
};

/* SVG Icons */
const BrandLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const PrinterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const QrIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

/* Export Utilities */
const exportCSV = (filename, headers, rows) => {
  const csvRows = rows.map(function(r) {
    return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
  });
  const csv = [headers.join(',')].concat(csvRows).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const printReport = (reportTitle, meta, headers, rows) => {
  const win = window.open('', '_blank');
  const headerCells = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
  const bodyRows = rows.map(function(r) {
    return '<tr>' + r.map(function(c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
  }).join('');
  const html = '<!DOCTYPE html><html><head><title>' + reportTitle + '</title>' +
    '<style>' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:30px;color:#1e293b;background:#fff}' +
    'h1{margin-bottom:4px;color:#0f172a;font-size:22px;font-weight:800}' +
    '.meta{color:#64748b;font-size:13px;margin-bottom:24px;border-bottom:2px solid #e2e8f0;padding-bottom:12px}' +
    'table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13px}' +
    'th,td{border:1px solid #cbd5e1;padding:10px 14px;text-align:left}' +
    'th{background:#f1f5f9;font-weight:700;color:#334155}' +
    'tr:nth-child(even){background:#f8fafc}' +
    '.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold}' +
    '.pass{background:#dcfce7;color:#166534}.fail{background:#fee2e2;color:#991b1b}' +
    '@media print{@page{margin:1.5cm}}' +
    '</style></head><body>' +
    '<h1>' + reportTitle + '</h1>' +
    '<div class="meta">' + meta + ' • Generated on ' + new Date().toLocaleString() + '</div>' +
    '<table><thead><tr>' + headerCells + '</tr></thead>' +
    '<tbody>' + bodyRows + '</tbody></table>' +
    '<script>window.onload=function(){window.print();}</' + 'script>' +
    '</' + 'body></' + 'html>';
  win.document.write(html);
  win.document.close();
};

/* WHATSAPP SHARE & QR SCANNER MODAL */
function WhatsAppShareModal({ title, subtitle, messageText, onClose }) {
  const [copied, setCopied] = useState(false);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(waUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: '#25D366' }}>
            <WhatsAppIcon/> <span>{title || 'WhatsApp Result Scanner'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px', lineHeight: 1.4 }}>
          {subtitle || 'Point your smartphone camera or WhatsApp QR scanner at the code below to instantly share your score report.'}
        </p>

        <div className="qr-container">
          <img src={qrUrl} alt="WhatsApp QR Code" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action btn-whatsapp"
            style={{ textDecoration: 'none', flex: 1 }}
          >
            <WhatsAppIcon/> Open in WhatsApp
          </a>
          <button
            type="button"
            className="btn-action btn-secondary"
            style={{ width: 'auto', padding: '10px 16px' }}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>

        <div style={{
          marginTop: 18,
          padding: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'left',
          maxHeight: 120,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {messageText}
        </div>
      </div>
    </div>
  );
}

/* REAL-TIME IST CLOCK */
function LiveISTClock() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return <span>{timeStr}</span>;
}

/* CUSTOM DARK-GLASS DATE PICKER */
function CustomDatePicker({ value, onChange, placeholder = 'Select schedule date' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const todayISO = getTodayISODate();

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const mondayOffset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const days = [];
  for (let i = mondayOffset - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrent: false, isPrev: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      isCurrent: true,
      iso: dStr,
      isToday: dStr === todayISO,
      isSelected: dStr === value
    });
  }
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrent: false, isNext: true });
  }

  const handleSelectDay = (cell) => {
    if (cell.isCurrent && cell.iso) {
      onChange(cell.iso);
      setOpen(false);
    }
  };

  const displayFormatted = value ? (() => {
    const parts = value.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return value;
  })() : placeholder;

  return (
    <div className="datepicker-wrap" ref={wrapRef}>
      <div
        className={`datepicker-input-box${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span style={{ color: value ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: value ? 600 : 400 }}>
          {displayFormatted}
        </span>
        <CalendarIcon/>
      </div>

      {open && (
        <div className="calendar-popover">
          <div className="cal-head">
            <button type="button" className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <div className="cal-title">
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button type="button" className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="cal-grid-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => (
              <div key={w} className="cal-weekday">{w}</div>
            ))}
          </div>

          <div className="cal-grid-days">
            {days.map((c, i) => (
              <div
                key={i}
                className={`cal-day-cell ${!c.isCurrent ? 'other-month' : ''} ${c.isToday ? 'today' : ''} ${c.isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectDay(c)}
              >
                {c.day}
              </div>
            ))}
          </div>

          <div className="cal-foot">
            <button
              type="button"
              className="cal-foot-btn"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="cal-foot-btn"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                onChange(todayISO);
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* TEACHER DASHBOARD */
const parseAiText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const questions = [];
  let currentQ = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isOption = /^(?:[A-D][\.\)\:]|\([A-D]\)|\-|\*\*[A-D][\.\)\:]\*\*)\s+(.*)/i.test(line);
    const isAnswer = /^(?:\*\*?)?(?:Answer|Correct Answer|Ans)(?:\:|\s+)?(?:\*\*?)?\s*([A-D])/i.test(line);

    if (isOption) {
      if (!currentQ) { currentQ = { question: 'Untitled Question', options: [], correctIndex: 0 }; }
      if (currentQ.options.length < 4) {
        currentQ.options.push(line.replace(/^(?:[A-D][\.\)\:]|\([A-D]\)|\-|\*\*[A-D][\.\)\:]\*\*)\s+/i, '').replace(/\*\*$/, '').replace(/^\*\*/, ''));
      }
    } else if (isAnswer) {
      if (currentQ) {
        const match = line.match(/^(?:\*\*?)?(?:Answer|Correct Answer|Ans)(?:\:|\s+)?(?:\*\*?)?\s*([A-D])/i);
        if (match && match[1]) {
          currentQ.correctIndex = match[1].toUpperCase().charCodeAt(0) - 65;
        }
      }
    } else {
      // It is neither an option nor an answer. Treat as question text.
      // If the current question already has options or an answer, start a new one.
      if (currentQ && (currentQ.options.length > 0 || currentQ.correctIndex !== 0)) {
        questions.push(currentQ);
        currentQ = null;
      }
      
      let cleanLine = line.replace(/^(?:Q?\d+[\.\:\)]|\*\*Q?\d*[\.\:\)]?\*\*?|Question|Q\:)\s+/i, '').replace(/\*\*$/, '').replace(/^\*\*/, '');
      if (!currentQ) {
        currentQ = { question: cleanLine, options: [], correctIndex: 0 };
      } else {
        currentQ.question += ' ' + cleanLine;
      }
    }
  }
  if (currentQ) questions.push(currentQ);
  
  return questions.map((q, idx) => {
    while (q.options.length < 4) q.options.push(`Option ${q.options.length + 1}`);
    return {
      id: 'q_' + Date.now() + '_' + idx,
      question: q.question,
      options: q.options.slice(0, 4),
      correctIndex: Math.max(0, Math.min(3, q.correctIndex))
    };
  });
};

function TeacherDashboard({ user, onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' | 'results'
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [todayFilter, setTodayFilter] = useState('all');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('all');
  const [searchStudent, setSearchStudent] = useState('');
  const [qrModal, setQrModal] = useState(null);
  
  // AI Import State
  const [showAiImport, setShowAiImport] = useState(false);
  const [aiImportText, setAiImportText] = useState('');
  const [aiMessage, setAiMessage] = useState(null);

  const todayStr = getTodayDateString();
  const todayISO = getTodayISODate();

  useEffect(() => {
    const qRef = firebase.database().ref('quizzes');
    const rRef = firebase.database().ref('results');

    const qListener = qRef.on('value', snap => {
      const data = snap.val() || {};
      setQuizzes(Object.values(data));
    });

    const rListener = rRef.on('value', snap => {
      const data = snap.val() || {};
      setResults(Object.values(data));
    });

    return () => {
      qRef.off('value', qListener);
      rRef.off('value', rListener);
    };
  }, []);

  const handleProcessAiImport = () => {
    if (!aiImportText.trim()) return;
    setAiMessage(null);
    const importedQs = parseAiText(aiImportText);
    if (importedQs.length > 0) {
      const isBlankQuestion = (q) => {
        if (q.question.trim() !== '') return false;
        return !q.options.some(opt => opt.trim() !== '' && !opt.startsWith('Option '));
      };
      
      const merged = [...editQuiz.questions, ...importedQs].filter(q => !isBlankQuestion(q));
      setEditQuiz({ ...editQuiz, questions: merged.length > 0 ? merged : editQuiz.questions });
      setAiImportText('');
      setAiMessage({ type: 'success', text: `Successfully imported ${importedQs.length} questions!` });
      setTimeout(() => setAiMessage(null), 3000);
      // close it automatically after a bit
      setTimeout(() => setShowAiImport(false), 2000);
    } else {
      setAiMessage({ type: 'error', text: 'Could not detect any questions. Please check the format.' });
    }
  };

  const handleOpenCreate = () => {
    setEditQuiz({
      id: 'quiz_' + Date.now(),
      title: '',
      subject: 'Computer Science',
      date: todayISO,
      startTime: '10:00 AM',
      durationMinutes: 15,
      questions: [
        {
          id: 'q_' + Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditQuiz(JSON.parse(JSON.stringify(q)));
    setModalOpen(true);
  };

  const handleDelete = (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      firebase.database().ref('quizzes/' + quizId).remove();
    }
  };

  const handleSaveQuiz = (q) => {
    if (!q.title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    for (let i = 0; i < q.questions.length; i++) {
      if (!q.questions[i].question.trim()) {
        alert(`Question #${i + 1} text cannot be blank.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.questions[i].options[j].trim()) {
          alert(`Option ${String.fromCharCode(65 + j)} for Question #${i + 1} cannot be blank.`);
          return;
        }
      }
    }
    q.lastEditedAt = Date.now();
    
    firebase.database().ref('quizzes/' + q.id).set(q).then(() => {
      setModalOpen(false);
      setEditQuiz(null);
    });
  };

  const displayedQuizzes = todayFilter === 'today'
    ? quizzes.filter(q => q.date === todayISO)
    : quizzes;

  // Filter student results
  const filteredResults = results.filter(r => {
    const matchesQuiz = selectedQuizFilter === 'all' || r.quizId === selectedQuizFilter || r.quizTitle === selectedQuizFilter;
    const matchesQuery = !searchStudent.trim() ||
      r.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesQuiz && matchesQuery;
  });

  // Calculate statistics
  const totalSubmissions = filteredResults.length;
  const avgPct = totalSubmissions ? Math.round(filteredResults.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalSubmissions) : 0;
  const passCount = filteredResults.filter(r => r.percentage >= 50).length;
  const passRate = totalSubmissions ? Math.round((passCount / totalSubmissions) * 100) : 0;
  const topScore = totalSubmissions ? Math.max(...filteredResults.map(r => r.percentage || 0)) : 0;

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Student Email / Roll', 'Quiz Title', 'Date Taken', 'Score', 'Total Questions', 'Percentage', 'Status'];
    const rows = filteredResults.map(r => [
      r.studentName,
      r.studentEmail,
      r.quizTitle,
      r.dateTaken,
      r.score,
      r.totalQuestions,
      `${r.percentage}%`,
      r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'
    ]);
    exportCSV(`student_results_${todayISO}.csv`, headers, rows);
  };

  const handlePrintPDF = () => {
    const headers = ['Student Name', 'Email / Roll', 'Quiz Title', 'Date', 'Score', 'Percentage', 'Status'];
    const rows = filteredResults.map(r => [
      r.studentName,
      r.studentEmail,
      r.quizTitle,
      r.dateTaken,
      `${r.score} / ${r.totalQuestions}`,
      `${r.percentage}%`,
      `<span class="badge ${r.percentage >= 50 ? 'pass' : 'fail'}">${r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}</span>`
    ]);
    printReport(
      'GPTKQuiz — Student Examination Performance Report',
      `Faculty: ${user.name} • Total Submissions: ${totalSubmissions} • Pass Rate: ${passRate}%`,
      headers,
      rows
    );
  };

  const handleOpenBatchWhatsAppQR = () => {
    const quizFound = quizzes.find(function(q) { return q.id === selectedQuizFilter; });
    const quizName = selectedQuizFilter === 'all' ? 'All Quizzes' : ((quizFound && quizFound.title) || selectedQuizFilter);
    const topScorers = [...filteredResults].sort((a, b) => b.percentage - a.percentage).slice(0, 3);
    
    let text = `*GPTKQuiz — Examination Performance Report*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Quiz:* ${quizName}\n`;
    text += `*Faculty:* ${user.name}\n`;
    text += `*Date:* ${todayStr}\n`;
    text += `*Total Submissions:* ${totalSubmissions}\n`;
    text += `*Average Score:* ${avgPct}%\n`;
    text += `*Pass Rate:* ${passRate}%\n\n`;
    if (topScorers.length > 0) {
      text += `*Top Performers:*\n`;
      topScorers.forEach((s, idx) => {
        text += `${idx + 1}. ${s.studentName} — ${s.percentage}% (${s.score}/${s.totalQuestions})\n`;
      });
      text += `\n`;
    }
    text += `_Generated via GPTKQuiz Academic Portal_`;

    setQrModal({
      title: 'WhatsApp Class Performance Report',
      subtitle: 'Scan with your smartphone camera or WhatsApp scanner to send this batch performance summary directly to student WhatsApp groups.',
      text
    });
  };

  const handleOpenStudentWhatsAppQR = (r) => {
    let text = `*GPTKQuiz Official Scorecard*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Student Name:* ${r.studentName}\n`;
    text += `*Roll / Email:* ${r.studentEmail}\n`;
    text += `*Quiz:* ${r.quizTitle}\n`;
    text += `*Date Taken:* ${r.dateTaken}\n`;
    text += `*Score:* ${r.score} / ${r.totalQuestions}\n`;
    text += `*Accuracy:* ${r.percentage}%\n`;
    text += `*Grade Status:* ${r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}\n\n`;
    text += `_Verified by Faculty: ${user.name}_`;

    setQrModal({
      title: `WhatsApp Result for ${r.studentName}`,
      subtitle: `Scan with your phone or WhatsApp scanner to send ${r.studentName}'s result card to their WhatsApp.`,
      text
    });
  };

  return (
    <div className="dash-wrap">
      {/* Top Header */}
      <header className="top-nav">
        <div className="nav-left">
          <div className="brand" style={{ margin: 0 }}>
            <div className="brand-icon"><BrandLogo/></div>
            <span className="brand-name">GPTKQuiz</span>
          </div>
        </div>

        <div className="nav-center">
          <CalendarIcon/> <span>{todayStr} &nbsp;•&nbsp; <LiveISTClock/></span>
        </div>

        <div className="nav-right">
          <div className="user-tag">
            <span>Lecturer:</span> <strong style={{ color: '#fff' }}>{user.name}</strong>
          </div>
          <button className="btn-logout" onClick={onLogout} type="button">
            <LogoutIcon/> Logout
          </button>
        </div>
      </header>

      {/* Primary Section Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn-action ${activeTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '9px 18px' }}
            onClick={() => setActiveTab('quizzes')}
          >
            Quizzes &amp; Question Sets ({quizzes.length})
          </button>
          <button
            className={`btn-action ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setActiveTab('results')}
          >
            <WhatsAppIcon/> Student Results &amp; WhatsApp Hub ({results.length})
          </button>
        </div>

        {activeTab === 'quizzes' ? (
          <button
            className="btn-action btn-start"
            style={{ width: 'auto', padding: '9px 18px' }}
            onClick={handleOpenCreate}
          >
            <PlusIcon/> Create New Quiz
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-action btn-secondary"
              style={{ width: 'auto', padding: '8px 14px' }}
              onClick={handleExportCSV}
              title="Download results as CSV spreadsheet"
            >
              <DownloadIcon/> Export CSV
            </button>
            <button
              className="btn-action btn-secondary"
              style={{ width: 'auto', padding: '8px 14px' }}
              onClick={handlePrintPDF}
              title="Print or Save PDF report card"
            >
              <PrinterIcon/> Print PDF
            </button>
            <button
              className="btn-action btn-whatsapp"
              style={{ width: 'auto', padding: '8px 16px' }}
              onClick={handleOpenBatchWhatsAppQR}
              title="Open WhatsApp summary QR scanner"
            >
              <QrIcon/> WhatsApp QR Hub
            </button>
          </div>
        )}
      </div>

      {/* 1. QUIZZES VIEW */}
      {activeTab === 'quizzes' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div className="sec-title" style={{ margin: 0 }}>
              <span>Manage Examination Sets &amp; Questions</span>
              <span className="sec-badge badge-past">Faculty Studio</span>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`btn-action ${todayFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                onClick={() => setTodayFilter('all')}
              >
                All ({quizzes.length})
              </button>
              <button
                className={`btn-action ${todayFilter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                onClick={() => setTodayFilter('today')}
              >
                Today ({quizzes.filter(q => q.date === todayISO).length})
              </button>
            </div>
          </div>

          {displayedQuizzes.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
              No quizzes found for this filter. Click <strong>+ Create New Quiz</strong> to build one.
            </div>
          ) : (
            <div className="quiz-grid">
              {displayedQuizzes.map(q => {
                const isToday = q.date === todayISO;
                return (
                  <div key={q.id} className={`quiz-card ${isToday ? 'is-live' : ''}`}>
                    <div>
                      <div className="quiz-header">
                        <div>
                          <div className="quiz-name">{q.title}</div>
                          <div className="quiz-sub">{q.subject}</div>
                        </div>
                        {isToday ? (
                          <span className="sec-badge badge-live">Today</span>
                        ) : (
                          <span className="sec-badge badge-soon">{q.date}</span>
                        )}
                      </div>

                      <div className="quiz-meta">
                        <div className="meta-item"><CalendarIcon/> {q.date}</div>
                        <div className="meta-item"><ClockIcon/> {q.startTime}</div>
                        <div className="meta-item"><ClockIcon/> {q.durationMinutes} Mins</div>
                        <div className="meta-item"><HelpIcon/> {q.questions.length} Questions</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        className="btn-action btn-secondary"
                        style={{ flex: 1, padding: '8px' }}
                        onClick={() => handleOpenEdit(q)}
                      >
                        <EditIcon/> Edit
                      </button>
                      <button
                        className="btn-action btn-danger"
                        style={{ width: 'auto', padding: '8px 12px' }}
                        onClick={() => handleDelete(q.id)}
                      >
                        <TrashIcon/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. STUDENT RESULTS & WHATSAPP HUB VIEW */}
      {activeTab === 'results' && (
        <div className="glass-card">
          <div className="sec-title">
            <span>Student Examination Records &amp; WhatsApp Dispatch</span>
            <span className="sec-badge badge-live">Live Analytics</span>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-lbl">Total Submissions</span>
              <span className="stat-val">{totalSubmissions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-lbl">Average Score</span>
              <span className="stat-val" style={{ color: '#86efac' }}>{avgPct}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-lbl">Highest Score</span>
              <span className="stat-val" style={{ color: '#c084fc' }}>{topScore}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-lbl">Passing Rate</span>
              <span className="stat-val" style={{ color: passRate >= 60 ? '#86efac' : '#fca5a5' }}>{passRate}%</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="field" style={{ margin: 0, flex: 1, minWidth: 200 }}>
              <span className="label">Filter by Quiz</span>
              <select
                className="input"
                style={{ cursor: 'pointer', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff' }}
                value={selectedQuizFilter}
                onChange={e => setSelectedQuizFilter(e.target.value)}
              >
                <option value="all" style={{ background: '#0f172a', color: '#fff' }}>All Quizzes</option>
                {quizzes.map(q => (
                  <option key={q.id} value={q.id} style={{ background: '#0f172a', color: '#fff' }}>{q.title}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ margin: 0, width: '100%', maxWidth: 280 }}>
              <span className="label">Search Student Name or Roll</span>
              <input
                className="input"
                placeholder="Search name, roll no, or email..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {filteredResults.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
              No student records match the selected filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="res-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Quiz Title</th>
                    <th>Date Taken</th>
                    <th>Score / Total</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>WhatsApp QR Scanner</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r, idx) => (
                    <tr key={r.id || idx}>
                      <td>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{r.studentName}</div>
                        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>{r.studentEmail}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#38bdf8' }}>{r.quizTitle}</div>
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {r.dateTaken}
                        {r.timeTaken && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{r.timeTaken}</div>}
                      </td>
                      <td style={{ fontWeight: 800, color: '#fff' }}>
                        {r.score} / {r.totalQuestions}
                      </td>
                      <td>
                        <strong style={{ color: r.percentage >= 60 ? '#86efac' : '#fca5a5' }}>
                          {r.percentage}%
                        </strong>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 9px', borderRadius: 8,
                          background: (r.remarks && r.remarks.includes('Disqualified')) ? 'rgba(239,68,68,0.2)' : r.percentage >= 80 ? 'rgba(34,197,94,0.15)' : r.percentage >= 50 ? 'rgba(56,189,248,0.15)' : 'rgba(239,68,68,0.15)',
                          color: (r.remarks && r.remarks.includes('Disqualified')) ? '#ef4444' : r.percentage >= 80 ? '#86efac' : r.percentage >= 50 ? '#38bdf8' : '#fca5a5',
                          fontWeight: 800, fontSize: 11.5
                        }}>
                          {(r.remarks && r.remarks.includes('Disqualified')) ? 'Disqualified' : r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-action btn-whatsapp"
                          style={{ width: 'auto', padding: '6px 12px', fontSize: 12, display: 'inline-flex' }}
                          onClick={() => handleOpenStudentWhatsAppQR(r)}
                          title="Generate WhatsApp QR code to scan and send result"
                        >
                          <WhatsAppIcon/> Send QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quiz Editor / Creator Modal */}
      {modalOpen && editQuiz && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                {quizzes.some(x => x.id === editQuiz.id) ? 'Edit Quiz & Questions' : 'Create New Examination Set'}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 20 }}
              >
                ✕
              </button>
            </div>

            {/* General Quiz Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
              <div className="field">
                <span className="label">Quiz Title</span>
                <input
                  className="input"
                  placeholder="e.g. Cloud Computing & Virtualization"
                  value={editQuiz.title}
                  onChange={e => setEditQuiz({ ...editQuiz, title: e.target.value })}
                />
              </div>
              <div className="field">
                <span className="label">Subject / Topic</span>
                <input
                  className="input"
                  placeholder="e.g. Computer Networks"
                  value={editQuiz.subject}
                  onChange={e => setEditQuiz({ ...editQuiz, subject: e.target.value })}
                />
              </div>
              <div className="field">
                <span className="label">Schedule Date</span>
                <CustomDatePicker
                  value={editQuiz.date}
                  onChange={d => setEditQuiz({ ...editQuiz, date: d })}
                />
              </div>
              <div className="field">
                <span className="label">Start Timing</span>
                <input
                  className="input"
                  placeholder="e.g. 10:30 AM"
                  value={editQuiz.startTime}
                  onChange={e => setEditQuiz({ ...editQuiz, startTime: e.target.value })}
                />
              </div>
              <div className="field">
                <span className="label">Duration (Minutes)</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={editQuiz.durationMinutes}
                  onChange={e => setEditQuiz({ ...editQuiz, durationMinutes: parseInt(e.target.value) || 10 })}
                />
              </div>
            </div>

            {/* Questions Builder */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 18, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
                  Questions ({editQuiz.questions.length})
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    style={{
                      width: 'auto', padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
                      background: showAiImport ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.1)',
                      color: showAiImport ? '#d8b4fe' : '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
                    }}
                    onClick={() => setShowAiImport(!showAiImport)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Import from AI
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-secondary"
                    style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }}
                    onClick={() => {
                      const nextQ = {
                        id: 'q_' + Date.now(),
                        question: '',
                        options: ['', '', '', ''],
                        correctIndex: 0
                      };
                      setEditQuiz({ ...editQuiz, questions: [...editQuiz.questions, nextQ] });
                    }}
                  >
                    <PlusIcon/> Add Question
                  </button>
                </div>
              </div>

              {showAiImport && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#fff', marginBottom: 12, fontWeight: 700 }}>
                    Paste questions generated by ChatGPT, Gemini, or Claude.
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong style={{ color: '#fff' }}>Format example:</strong>
                      <br/>1. What is HTML?
                      <br/>A) Language
                      <br/>B) Software
                      <br/>C) Hardware
                      <br/>D) OS
                      <br/>Answer: A
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.8)', background: 'rgba(56,189,248,0.08)', padding: 12, borderRadius: 10, border: '1px dashed rgba(56,189,248,0.3)' }}>
                      <strong style={{ color: '#38bdf8' }}>Copy this prompt to ChatGPT/Gemini:</strong>
                      <div style={{ marginTop: 6, fontFamily: 'monospace', color: '#fff', fontSize: 11 }}>
                        Create a multiple-choice quiz about [TOPIC] with [NUMBER] questions. Provide 4 options per question (A, B, C, D). Format exactly like this: 1. Question? A) Option B) Option C) Option D) Option Answer: A
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          navigator.clipboard.writeText('Create a multiple-choice quiz about [TOPIC] with [NUMBER] questions. Provide 4 options per question (A, B, C, D). Format exactly like this:\n1. Question?\nA) Option\nB) Option\nC) Option\nD) Option\nAnswer: A');
                          const old = e.target.innerText;
                          e.target.innerText = 'Copied!';
                          setTimeout(() => e.target.innerText = old, 2000);
                        }}
                        style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11.5, marginTop: 10, cursor: 'pointer', fontWeight: 800, transition: 'all 0.2s' }}
                      >
                        Copy Prompt
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="input"
                    style={{
                      width: '100%', height: 140, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, color: '#fff', padding: 12, fontSize: 13, resize: 'vertical'
                    }}
                    placeholder="Paste the response from AI here..."
                    value={aiImportText}
                    onChange={e => setAiImportText(e.target.value)}
                  />
                  {aiMessage && (
                    <div style={{
                      marginTop: 10, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: aiMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: aiMessage.type === 'success' ? '#4ade80' : '#f87171',
                      border: `1px solid ${aiMessage.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {aiMessage.text}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn-action btn-start"
                      onClick={handleProcessAiImport}
                      style={{ padding: '8px 20px', width: 'auto' }}
                    >
                      Process & Add Questions
                    </button>
                  </div>
                </div>
              )}

              {editQuiz.questions.map((q, qIndex) => (
                <div
                  key={q.id || qIndex}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 14
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                      Question #{qIndex + 1}
                    </span>
                    {editQuiz.questions.length > 1 && (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}
                        onClick={() => {
                          const updated = editQuiz.questions.filter((_, idx) => idx !== qIndex);
                          setEditQuiz({ ...editQuiz, questions: updated });
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="field">
                    <input
                      className="input"
                      placeholder={`Enter question #${qIndex + 1}...`}
                      value={q.question}
                      onChange={e => {
                        const updated = [...editQuiz.questions];
                        updated[qIndex].question = e.target.value;
                        setEditQuiz({ ...editQuiz, questions: updated });
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = q.correctIndex === optIdx;
                      return (
                        <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...editQuiz.questions];
                              updated[qIndex].correctIndex = optIdx;
                              setEditQuiz({ ...editQuiz, questions: updated });
                            }}
                            style={{
                              width: 28, height: 28, borderRadius: 8,
                              background: isCorrect ? '#10b981' : 'rgba(255,255,255,0.08)',
                              color: isCorrect ? '#fff' : 'rgba(255,255,255,0.5)',
                              border: isCorrect ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                              fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
                            }}
                            title="Click to set as correct answer"
                          >
                            {letter}
                          </button>
                          <input
                            className="input"
                            style={{ padding: '8px 10px', fontSize: 12.5 }}
                            placeholder={`Option ${letter}`}
                            value={opt}
                            onChange={e => {
                              const updated = [...editQuiz.questions];
                              updated[qIndex].options[optIdx] = e.target.value;
                              setEditQuiz({ ...editQuiz, questions: updated });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                    Tip: Click the letter button (A, B, C, D) to mark which option is the correct answer.
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn-action btn-secondary"
                style={{ width: 'auto', padding: '10px 18px' }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-action btn-start"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={() => handleSaveQuiz(editQuiz)}
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Share QR Modal */}
      {qrModal && (
        <WhatsAppShareModal
          title={qrModal.title}
          subtitle={qrModal.subtitle}
          messageText={qrModal.text}
          onClose={() => setQrModal(null)}
        />
      )}
    </div>
  );
}

/* STUDENT QUIZ RUNNER */
function StudentQuizRunner({ quiz, studentUser, onClose, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [qrModal, setQrModal] = useState(null);

  // Anti-cheat & Pre-start
  const [preStartTimer, setPreStartTimer] = useState(10);
  const [hasStarted, setHasStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Pre-start countdown
  useEffect(() => {
    if (hasStarted) return;
    const timer = setInterval(() => {
      setPreStartTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasStarted]);

  // Quiz active countdown
  useEffect(() => {
    if (!hasStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasStarted, isSubmitted]);

  // Anti-cheat Visibility Listener
  useEffect(() => {
    if (!hasStarted || isSubmitted) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(w => {
          const newWarnings = w + 1;
          if (newWarnings >= 2) {
            // Fail and auto-submit
            handleSubmit(false, true); 
          } else {
            setShowWarningModal(true);
          }
          return newWarnings;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, isSubmitted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentQ = quiz.questions[currentIdx];

  const handleSelectOption = (optIdx) => {
    if (isSubmitted || !hasStarted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: optIdx });
  };

  const handleSubmit = (timeout = false, antiCheatFail = false) => {
    if (isSubmitted) return;
    
    let correct = 0;
    if (!antiCheatFail) {
      quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
    }
    
    const total = quiz.questions.length;
    const pct = antiCheatFail ? 0 : Math.round((correct / total) * 100);

    const result = {
      id: 'res_' + Date.now(),
      studentEmail: studentUser.email || studentUser.rollNo,
      studentName: studentUser.name,
      quizId: quiz.id,
      quizTitle: quiz.title,
      dateTaken: getTodayISODate(),
      timeTaken: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      score: antiCheatFail ? 0 : correct,
      totalQuestions: total,
      percentage: pct,
      remarks: antiCheatFail ? 'Disqualified (Tab Switching)' : 'Completed',
      quizVersion: quiz.lastEditedAt || 0
    };

    firebase.database().ref('results/' + result.id).set(result).then(() => {
      setScoreResult(result);
      setIsSubmitted(true);
      setShowWarningModal(false);
    });
  };

  const handleShareWhatsApp = () => {
    if (!scoreResult) return;
    let text = `*My GPTKQuiz Test Result*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Student:* ${studentUser.name}\n`;
    text += `*Roll / Email:* ${studentUser.email || studentUser.rollNo}\n`;
    text += `*Quiz:* ${quiz.title}\n`;
    text += `*Date:* ${getTodayDateString()}\n`;
    text += `*Score:* ${scoreResult.score} / ${scoreResult.totalQuestions}\n`;
    text += `*Accuracy:* ${scoreResult.percentage}%\n`;
    text += `*Grade Status:* ${scoreResult.percentage >= 80 ? 'Distinction' : scoreResult.percentage >= 50 ? 'Passed' : 'Needs Review'}\n\n`;
    text += `_Verified by GPTKQuiz University Portal_`;

    setQrModal({
      title: 'WhatsApp Result Card',
      subtitle: 'Scan with your smartphone camera or WhatsApp scanner to send your scorecard directly.',
      text
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 640, position: 'relative', overflow: 'hidden' }}>
        
        {/* Anti-cheat Warning Modal */}
        {showWarningModal && !isSubmitted && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
            <div style={{ color: '#ef4444', marginBottom: 16 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>WARNING! Tab Switch Detected</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 24, maxWidth: 400 }}>
              You navigated away from the quiz window. This is your <strong>first and only warning</strong>. If you leave the tab again, your quiz will be automatically submitted and marked as a failure.
            </p>
            <button className="btn-action btn-start" onClick={() => setShowWarningModal(false)}>
              I Understand, Return to Quiz
            </button>
          </div>
        )}

        {/* Pre-start Timer */}
        {!hasStarted && !isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ color: '#38bdf8', marginBottom: 20 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Quiz Starts In...</h2>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#38bdf8', marginBottom: 24, textShadow: '0 0 20px rgba(56,189,248,0.4)' }}>
              {preStartTimer}
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: 16, color: '#fca5a5', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              <strong>Anti-Cheat Active:</strong> Do NOT switch tabs or minimize your browser during the test. Doing so will result in an automatic failure.
            </div>
          </div>
        ) : !isSubmitted ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{quiz.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{quiz.subject}</div>
              </div>
              <div style={{
                background: timeLeft < 60 ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.12)',
                border: `1.5px solid ${timeLeft < 60 ? '#f87171' : '#38bdf8'}`,
                color: timeLeft < 60 ? '#f87171' : '#38bdf8',
                padding: '6px 14px', borderRadius: 12, fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <ClockIcon/> {timeFormatted}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {quiz.questions.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    flex: 1, height: 6, borderRadius: 3, cursor: 'pointer',
                    background: selectedAnswers[idx] !== undefined
                      ? '#38bdf8'
                      : idx === currentIdx
                        ? 'rgba(255,255,255,0.6)'
                        : 'rgba(255,255,255,0.15)'
                  }}
                />
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Question {currentIdx + 1} of {quiz.questions.length}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
                {currentQ.question}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <div
                    key={optIdx}
                    className={`opt-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(optIdx)}
                  >
                    <div className="opt-letter">{letter}</div>
                    <div style={{ fontSize: 14.5, color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                      {opt}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-action btn-secondary"
                style={{ width: 'auto', padding: '9px 18px' }}
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              >
                Previous
              </button>

              {currentIdx < quiz.questions.length - 1 ? (
                <button
                  type="button"
                  className="btn-action btn-primary"
                  style={{ width: 'auto', padding: '9px 24px' }}
                  onClick={() => setCurrentIdx(i => i + 1)}
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-action btn-start"
                  style={{ width: 'auto', padding: '9px 24px' }}
                  onClick={handleSubmit}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', 
              background: scoreResult.remarks.includes('Disqualified') ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
              border: `2px solid ${scoreResult.remarks.includes('Disqualified') ? '#ef4444' : '#22c55e'}`, 
              color: scoreResult.remarks.includes('Disqualified') ? '#ef4444' : '#22c55e', 
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px', fontSize: 28
            }}>
              {scoreResult.remarks.includes('Disqualified') ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : <CheckIcon/>}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {scoreResult.remarks.includes('Disqualified') ? 'Quiz Failed!' : 'Quiz Completed!'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
              {scoreResult.remarks.includes('Disqualified') 
                ? 'Your quiz was automatically submitted due to an anti-cheat violation (Tab Switching).'
                : 'Your responses have been recorded and saved to the university database.'}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '20px', maxWidth: 360, margin: '0 auto 20px'
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Final Score
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#38bdf8', margin: '6px 0' }}>
                {scoreResult.score} / {scoreResult.totalQuestions}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: scoreResult.percentage >= 60 ? '#86efac' : '#fca5a5' }}>
                Accuracy: {scoreResult.percentage}%
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <button
                type="button"
                className="btn-action btn-whatsapp"
                style={{ maxWidth: 220 }}
                onClick={handleShareWhatsApp}
              >
                <WhatsAppIcon/> Share via WhatsApp
              </button>
              <button
                className="btn-action btn-start"
                style={{ maxWidth: 200 }}
                onClick={() => {
                  onFinish();
                  onClose();
                }}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp QR Modal */}
        {qrModal && (
          <WhatsAppShareModal
            title={qrModal.title}
            subtitle={qrModal.subtitle}
            messageText={qrModal.text}
            onClose={() => setQrModal(null)}
          />
        )}
      </div>
    </div>
  );
}

/* STUDENT DASHBOARD */
function StudentDashboard({ user, onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qrModal, setQrModal] = useState(null);

  const todayStr = getTodayDateString();
  const todayISO = getTodayISODate();

  useEffect(() => {
    const qRef = firebase.database().ref('quizzes');
    const rRef = firebase.database().ref('results');

    const qListener = qRef.on('value', snap => {
      const data = snap.val() || {};
      setQuizzes(Object.values(data));
    });

    const rListener = rRef.on('value', snap => {
      const data = snap.val() || {};
      setResults(Object.values(data));
    });

    return () => {
      qRef.off('value', qListener);
      rRef.off('value', rListener);
    };
  }, []);

  const studentResults = results.filter(r => r.studentEmail === user.email || r.studentName === user.name || r.studentEmail === user.rollNo);
  const todayQuizzes = quizzes.filter(q => q.date === todayISO);
  const upcomingQuizzes = quizzes.filter(q => q.date > todayISO);

  const handleShareResultQR = (r) => {
    let text = `*My GPTKQuiz Official Scorecard*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Student Name:* ${user.name}\n`;
    text += `*Roll / Email:* ${user.rollNo || user.email}\n`;
    text += `*Quiz:* ${r.quizTitle}\n`;
    text += `*Date Taken:* ${r.dateTaken}\n`;
    text += `*Score:* ${r.score} / ${r.totalQuestions}\n`;
    text += `*Accuracy:* ${r.percentage}%\n`;
    text += `*Grade Status:* ${r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}\n\n`;
    text += `_Verified by GPTKQuiz University Portal_`;

    setQrModal({
      title: 'Share My Scorecard to WhatsApp',
      subtitle: 'Scan with your smartphone camera or WhatsApp scanner to send your scorecard directly.',
      text
    });
  };

  const handleExportMyCSV = () => {
    const headers = ['Quiz Title', 'Date Taken', 'Score', 'Total Questions', 'Percentage', 'Grade Status'];
    const rows = studentResults.map(r => [
      r.quizTitle,
      r.dateTaken,
      r.score,
      r.totalQuestions,
      `${r.percentage}%`,
      r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'
    ]);
    exportCSV(`my_results_${user.name.replace(/\s+/g, '_')}_${todayISO}.csv`, headers, rows);
  };

  const handlePrintMyPDF = () => {
    const headers = ['Quiz Title', 'Date Taken', 'Score', 'Percentage', 'Status'];
    const rows = studentResults.map(r => [
      r.quizTitle,
      r.dateTaken,
      `${r.score} / ${r.totalQuestions}`,
      `${r.percentage}%`,
      `<span class="badge ${r.percentage >= 50 ? 'pass' : 'fail'}">${r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}</span>`
    ]);
    printReport(
      `GPTKQuiz — Official Grade Report for ${user.name}`,
      `Student ID: ${user.rollNo || user.email} • Tests Completed: ${studentResults.length}`,
      headers,
      rows
    );
  };

  return (
    <div className="dash-wrap">
      {/* Top Navigation Header */}
      <header className="top-nav">
        <div className="nav-left">
          <div className="brand" style={{ margin: 0 }}>
            <div className="brand-icon"><BrandLogo/></div>
            <span className="brand-name">GPTKQuiz</span>
          </div>
        </div>

        <div className="nav-center">
          <CalendarIcon/> <span>{todayStr} &nbsp;•&nbsp; <LiveISTClock/></span>
        </div>

        <div className="nav-right">
          <div className="user-tag" style={{ background: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.25)', color: '#c084fc' }}>
            <span>Student:</span> <strong style={{ color: '#fff' }}>{user.name}</strong>
          </div>
          <button className="btn-logout" onClick={onLogout} type="button">
            <LogoutIcon/> Logout
          </button>
        </div>
      </header>

      {/* 1. Live & Today's Examination Sets */}
      <section className="glass-card">
        <div className="sec-title">
          <span>Today's Live Examination Arena</span>
          <span className="sec-badge badge-live">Live Now / Today</span>
        </div>

        {todayQuizzes.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
            No examinations scheduled for today. Check upcoming tests below.
          </div>
        ) : (
          <div className="quiz-grid">
            {todayQuizzes.map(q => {
              const completedRecord = studentResults.find(r => 
                (r.quizId === q.id || r.quizTitle === q.title) && 
                ((r.quizVersion || 0) >= (q.lastEditedAt || 0))
              );
              return (
                <div key={q.id} className="quiz-card is-live">
                  <div>
                    <div className="quiz-header">
                      <div>
                        <div className="quiz-name">{q.title}</div>
                        <div className="quiz-sub">{q.subject}</div>
                      </div>
                      <span className="sec-badge badge-live">Active</span>
                    </div>

                    <div className="quiz-meta">
                      <div className="meta-item"><ClockIcon/> Start: {q.startTime}</div>
                      <div className="meta-item"><ClockIcon/> {q.durationMinutes} Minutes</div>
                      <div className="meta-item"><HelpIcon/> {q.questions.length} Questions</div>
                    </div>
                  </div>

                  {completedRecord ? (
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <CheckIcon/> You attended already
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11.5px' }}>
                        On {completedRecord.dateTaken}{completedRecord.timeTaken ? ` at ${completedRecord.timeTaken}` : ''}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-action btn-start"
                      onClick={() => setActiveQuiz(q)}
                    >
                      Start Quiz Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Near Date Scheduled Tests */}
      <section className="glass-card">
        <div className="sec-title">
          <span>Upcoming Scheduled Tests</span>
          <span className="sec-badge badge-soon">Near Date</span>
        </div>

        {upcomingQuizzes.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
            No upcoming tests scheduled in the calendar yet.
          </div>
        ) : (
          <div className="quiz-grid">
            {upcomingQuizzes.map(q => (
              <div key={q.id} className="quiz-card">
                <div>
                  <div className="quiz-header">
                    <div>
                      <div className="quiz-name">{q.title}</div>
                      <div className="quiz-sub">{q.subject}</div>
                    </div>
                    <span className="sec-badge badge-soon">{q.date}</span>
                  </div>

                  <div className="quiz-meta">
                    <div className="meta-item"><CalendarIcon/> {q.date}</div>
                    <div className="meta-item"><ClockIcon/> {q.startTime}</div>
                    <div className="meta-item"><ClockIcon/> {q.durationMinutes} Mins</div>
                    <div className="meta-item"><HelpIcon/> {q.questions.length} Questions</div>
                  </div>
                </div>

                <button className="btn-action btn-secondary" disabled style={{ opacity: 0.7, cursor: 'default' }}>
                  Scheduled: {q.date} ({q.startTime})
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Results of Past Tests */}
      <section className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="sec-title" style={{ margin: 0 }}>
            <span>Past Examination Performance &amp; Results</span>
            <span className="sec-badge badge-past">Verified Records</span>
          </div>

          {studentResults.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-action btn-secondary"
                style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                onClick={handleExportMyCSV}
              >
                <DownloadIcon/> Export CSV
              </button>
              <button
                type="button"
                className="btn-action btn-secondary"
                style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                onClick={handlePrintMyPDF}
              >
                <PrinterIcon/> Print PDF
              </button>
            </div>
          )}
        </div>

        {studentResults.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
            You have not completed any tests yet. Start today's test above to view your score report!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {studentResults.map((r, idx) => (
              <div key={r.id || idx} className="res-row" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{r.quizTitle}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    Date Completed: {r.dateTaken}{r.timeTaken ? ` at ${r.timeTaken}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#38bdf8' }}>
                      {r.score} / {r.totalQuestions}
                    </div>
                    <div style={{ fontSize: 11.5, color: r.percentage >= 60 ? '#86efac' : '#fca5a5', fontWeight: 700 }}>
                      {r.percentage}% Accuracy
                    </div>
                  </div>

                  <span style={{
                    padding: '6px 12px', borderRadius: 10,
                    background: r.percentage >= 80 ? 'rgba(34,197,94,0.15)' : 'rgba(56,189,248,0.15)',
                    color: r.percentage >= 80 ? '#86efac' : '#38bdf8',
                    fontWeight: 800, fontSize: 12
                  }}>
                    {r.percentage >= 80 ? 'Distinction' : r.percentage >= 50 ? 'Passed' : 'Needs Review'}
                  </span>

                  <button
                    type="button"
                    className="btn-action btn-whatsapp"
                    style={{ width: 'auto', padding: '7px 14px', fontSize: 12 }}
                    onClick={() => handleShareResultQR(r)}
                  >
                    <WhatsAppIcon/> WhatsApp QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Live Quiz Runner Modal */}
      {activeQuiz && (
        <StudentQuizRunner
          quiz={activeQuiz}
          studentUser={user}
          onClose={() => setActiveQuiz(null)}
          onFinish={() => {}}
        />
      )}

      {/* WhatsApp QR Modal */}
      {qrModal && (
        <WhatsAppShareModal
          title={qrModal.title}
          subtitle={qrModal.subtitle}
          messageText={qrModal.text}
          onClose={() => setQrModal(null)}
        />
      )}
    </div>
  );
}

/* AUTHENTICATION VIEW */
const LoginPanel = React.forwardRef(({ onSwitch, onLoggedIn }, ref) => {
  const [mode, setMode] = useState('student');
  const [email, setEm]  = useState('');
  const [pw, setPw]     = useState('');
  const [show, setSh]   = useState(false);
  const [err, setErr]   = useState('');
  const [l, setL]       = useState(false);

  const pwRef = React.useRef(null);

  const login = () => {
    setErr('');
    if (!email.trim() || !pw.trim()) {
      setErr('Please enter your credentials.');
      return;
    }

    // Master Admin Login (Firebase Auth persistent)
    if ((email.trim().toLowerCase() === 'admin' || email.trim() === 'admin@gptkquiz.edu') && pw === 'CSE@2026') {
      setL(true);
      const adminEmail = 'admin@gptkquiz.edu';
      const adminPw = 'CSE@2026';
      
      firebase.auth().signInWithEmailAndPassword(adminEmail, adminPw)
        .then(() => {
          onLoggedIn({ uid: 'ADMIN01', name: 'Faculty Administrator', email: adminEmail, role: 'teacher' });
        })
        .catch(err => {
          // If admin account doesn't exist yet, create it automatically
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            firebase.auth().createUserWithEmailAndPassword(adminEmail, adminPw)
              .then(() => {
                onLoggedIn({ uid: 'ADMIN01', name: 'Faculty Administrator', email: adminEmail, role: 'teacher' });
              })
              .catch(createErr => {
                setErr(createErr.message);
                setL(false);
              });
          } else {
            setErr(err.message);
            setL(false);
          }
        });
      return;
    }

    setL(true);
    firebase.auth().signInWithEmailAndPassword(email.trim(), pw)
      .then(function(userCredential) {
        return firebase.database().ref('users/' + userCredential.user.uid).once('value')
          .then(function(snapshot) {
            var data = snapshot.val() || {};
            onLoggedIn({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              name: data.name || 'Student',
              role: data.role || 'student',
              rollNo: data.rollNo || '',
              course: data.course || ''
            });
          });
      })
      .catch(function(error) {
        setErr(error.message);
        setL(false);
      });
  };

  const handleGoogleLogin = () => {
    setErr('');
    setL(true);
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function(userCredential) {
        return firebase.database().ref('users/' + userCredential.user.uid).once('value')
          .then(function(snapshot) {
            var data = snapshot.val();
            var savePromise = data ? Promise.resolve() :
              firebase.database().ref('users/' + userCredential.user.uid).set({
                name: userCredential.user.displayName || 'Google User',
                email: userCredential.user.email,
                role: 'student',
                createdAt: new Date().toISOString()
              });
            return savePromise.then(function() {
              onLoggedIn({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: (data && data.name) || userCredential.user.displayName || 'Student',
                role: (data && data.role) || 'student',
                rollNo: (data && data.rollNo) || '',
                course: (data && data.course) || ''
              });
            });
          });
      })
      .catch(function(error) {
        setErr(error.message);
        setL(false);
      });
  };

  return (
    <div ref={ref} className="slide-panel" style={{ width: '100%' }}>
      <div className="brand">
        <div className="brand-icon"><BrandLogo/></div>
        <span className="brand-name">GPTKQuiz</span>
      </div>
      <div className="title">Welcome back</div>
      <div className="sub">Sign in to access your portal.</div>

      {/* Student / Teacher Toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, margin: '20px 0 0' }}>
        <button
          type="button"
          onClick={() => { setMode('student'); setEm(''); setPw(''); setErr(''); }}
          style={{
            flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            fontSize: 14, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: mode === 'student' ? 'rgba(255,255,255,0.18)' : 'transparent',
            color: mode === 'student' ? '#fff' : 'rgba(255,255,255,0.5)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          Student
        </button>
        <button
          type="button"
          onClick={() => { setMode('teacher'); setEm(''); setPw(''); setErr(''); }}
          style={{
            flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            fontSize: 14, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: mode === 'teacher' ? 'rgba(99,102,241,0.4)' : 'transparent',
            color: mode === 'teacher' ? '#fff' : 'rgba(255,255,255,0.5)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Teacher
        </button>
      </div>

      {err && (
        <div className="alert err" style={{ marginTop: 16 }}>
          <AlertIcon/> <span>{err}</span>
        </div>
      )}

      {/* Teacher: show email + password form */}
      {mode === 'teacher' && (
        <>
          <div className="field" style={{ marginTop: 20 }}>
            <span className="label">Email Address</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEm(e.target.value); setErr(''); }}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); if (pwRef.current) pwRef.current.focus(); }
              }}
            />
          </div>
          <div className="field">
            <div className="pw-row">
              <span className="label" style={{ margin: 0 }}>Password</span>
            </div>
            <div className="pw-wrap">
              <input
                ref={pwRef}
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                value={pw}
                onChange={e => { setPw(e.target.value); setErr(''); }}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ paddingRight: 40 }}
              />
              <button type="button" className="eye" onClick={() => setSh(s => !s)} tabIndex={-1}>
                {show ? <EyeOpenIcon/> : <EyeClosedIcon/>}
              </button>
            </div>
          </div>
          <button className="btn" type="button" onClick={login} disabled={l}
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', marginTop: 8 }}>
            {l ? <span className="spin"/> : 'Teacher Sign In'}
          </button>
        </>
      )}

      {/* Student: only Google Sign-In */}
      {mode === 'student' && (
        <>
          <div style={{ marginTop: 32, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16 }}>
            Sign in with your Google account to continue
          </div>
          <button className="btn" type="button" onClick={handleGoogleLogin} disabled={l}
            style={{ background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <GoogleIcon/>
            <span style={{ fontWeight: 600 }}>Sign in with Google</span>
          </button>
        </>
      )}
    </div>
  );
});


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9ZCIUwY9y-yjZewp8z-6gfhJSftyslco",
  authDomain: "gptk-quiz.firebaseapp.com",
  databaseURL: "https://gptk-quiz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gptk-quiz",
  storageBucket: "gptk-quiz.firebasestorage.app",
  messagingSenderId: "709424873311",
  appId: "1:709424873311:web:ddb7532cf293ac6057c0ea",
  measurementId: "G-M8464JMH3H"
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}

function ProfileSetupPanel({ user, onComplete }) {
  const [name, setName]     = useState(user.name || '');
  const [rollNo, setRollNo] = useState('');
  const [course, setCourse] = useState('');
  const [err, setErr]       = useState('');
  const [l, setL]           = useState(false);

  const save = () => {
    setErr('');
    if (!name.trim() || !rollNo.trim() || !course.trim()) {
      setErr('Please fill out all fields.');
      return;
    }
    setL(true);
    const updates = { name: name.trim(), rollNo: rollNo.trim(), course: course.trim() };
    firebase.database().ref('users/' + user.uid).update(updates)
      .then(function() {
        onComplete({ ...user, ...updates });
      })
      .catch(function(error) {
        setErr(error.message);
        setL(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="slide-panel" style={{ position: 'relative', width: 400, opacity: 1, visibility: 'visible' }}>
        <div className="brand">
          <div className="brand-icon"><BrandLogo/></div>
          <span className="brand-name">GPTKQuiz</span>
        </div>
        <div className="title" style={{ fontSize: 20 }}>Complete Your Profile</div>
        <div className="sub">Welcome! Please provide your details to continue.</div>

        {err && (
          <div className="alert err" style={{ marginTop: 16 }}>
            <AlertIcon/> <span>{err}</span>
          </div>
        )}

        <div className="field" style={{ marginTop: 24 }}>
          <span className="label">Your Full Name</span>
          <input className="input" placeholder="e.g. Vasudevan S" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field">
          <span className="label">Register Number</span>
          <input className="input" placeholder="e.g. 23CS01" value={rollNo} onChange={e => setRollNo(e.target.value)} />
        </div>
        <div className="field">
          <span className="label">Course You Have Taken</span>
          <input className="input" placeholder="e.g. B.Tech Computer Science" value={course} onChange={e => setCourse(e.target.value)} />
        </div>

        <button className="btn" type="button" onClick={save} disabled={l} style={{ marginTop: 24 }}>
          {l ? <div className="spinner"></div> : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

function CookieConsent() {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('cookieConsent') === 'true';
  });

  if (accepted) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid #334155',
      padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 9999, color: '#e2e8f0', fontSize: '14px', backdropFilter: 'blur(10px)'
    }}>
      <div>
        <strong>Cookie Policy:</strong> We use cookies and local storage to keep you securely logged in and improve your experience on GPTKQuiz.
      </div>
      <button 
        className="btn" 
        style={{ width: 'auto', padding: '8px 24px', marginLeft: '16px', minHeight: 'auto' }}
        onClick={() => {
          localStorage.setItem('cookieConsent', 'true');
          setAccepted(true);
        }}
      >
        Accept
      </button>
    </div>
  );
}

/* ROOT APP */
function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState(undefined);

  const loginRef  = useRef(null);
  const signupRef = useRef(null);


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
        // Master Admin Check
        if (firebaseUser.email === 'admin@gptkquiz.edu' || firebaseUser.uid === 'ADMIN01') {
          setUser({ uid: firebaseUser.uid, name: 'Faculty Administrator', email: firebaseUser.email, role: 'teacher' });
          setLoading(false);
          return;
        }

        firebase.database().ref('users/' + firebaseUser.uid).once('value')
          .then(function(snapshot) {
            var data = snapshot.val() || {};
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name || firebaseUser.displayName || 'Student',
              role: data.role || 'student',
              rollNo: data.rollNo || '',
              class: data.class || '',
              course: data.course || ''
            });
            setLoading(false);
          })
          .catch(function(err) {
            console.error(err);
            setUser(null);
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (u) => {
    // Optimistic update; firebase auth state will also catch up
    setUser(u);
  };

  const handleLogout = () => {
    firebase.auth().signOut().then(function() {
      setUser(null);
    });
  };

  useEffect(() => {
    if (user) return;
    const measure = () => {
      if (screen === 'login' && loginRef.current) {
        setContainerHeight(loginRef.current.offsetHeight);
      } else if (screen === 'signup' && signupRef.current) {
        setContainerHeight(signupRef.current.offsetHeight);
      }
    };

    measure();
    const timer = setTimeout(measure, 40);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      if (loginRef.current) observer.observe(loginRef.current);
      if (signupRef.current) observer.observe(signupRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [screen, user]);

  /* Render Dashboards when logged in */
  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading GPTKQuiz...</div>;
  }

  if (user) {
    if (user.role === 'teacher') {
      return (
        <>
          <TeacherDashboard user={user} onLogout={handleLogout}/>
          <CookieConsent />
        </>
      );
    } else {
      if (!user.rollNo) {
        return (
          <>
            <ProfileSetupPanel user={user} onComplete={handleLogin} />
            <CookieConsent />
          </>
        );
      }
      return (
        <>
          <StudentDashboard user={user} onLogout={handleLogout}/>
          <CookieConsent />
        </>
      );
    }
  }

  /* Render Authentication Screen */
  return (
    <>
      <div className="auth-container">
        <div className="slide-outer" style={{ width: 410 }}>
          <LoginPanel onLoggedIn={handleLogin} />
        </div>
      </div>
      <CookieConsent />
    </>
  );
}



export default App;
