import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import Avatar from './Avatar';
import clsx from 'clsx';

/**
 * Searchable multi-select for picking users.
 * Props:
 *  - users: full list of { _id, name, email, avatar }
 *  - value: string[]  (array of selected _ids)
 *  - onChange: (ids: string[]) => void
 *  - error: string | undefined
 */
export default function UserCombobox({ users = [], value = [], onChange, error }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedUsers = users.filter((u) => value.includes(u._id));
  const filtered = users.filter((u) => {
    if (value.includes(u._id)) return false; // hide already selected
    const q = query.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const select = (id) => {
    onChange([...value, id]);
    setQuery('');
    inputRef.current?.focus();
  };

  const remove = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Assignees
      </span>

      {/* Trigger box */}
      <div
        className={clsx(
          'input flex min-h-[42px] cursor-text flex-wrap items-center gap-1.5 py-1.5 pr-8',
          error && 'border-rose-500 focus-within:ring-rose-500/30'
        )}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
      >
        {/* Selected chips */}
        {selectedUsers.map((u) => (
          <span
            key={u._id}
            className="flex items-center gap-1 rounded-md bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-800/40 dark:text-brand-200"
          >
            <Avatar user={u} size={16} />
            {u.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(u._id); }}
              className="ml-0.5 rounded hover:text-brand-900"
            >
              <X size={11} />
            </button>
          </span>
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selectedUsers.length === 0 ? 'Type to search users…' : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
        />

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={clsx(
            'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>

      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 scrollbar-thin">
          {filtered.length === 0 ? (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400">
              <Search size={14} />
              {query ? `No users matching "${query}"` : 'No more users to add'}
            </li>
          ) : (
            filtered.map((u) => (
              <li key={u._id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur
                  onClick={() => select(u._id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-800/30"
                >
                  <Avatar user={u} size={24} />
                  <span className="font-medium">{u.name}</span>
                  <span className="ml-auto text-xs text-slate-400">{u.email}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
