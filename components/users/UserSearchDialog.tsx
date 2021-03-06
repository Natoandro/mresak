import axios from 'axios';
import clsx from 'clsx';
import { ChangeEvent, forwardRef, MouseEvent, useEffect, useRef, useState, useTransition } from 'react';
import { UserAttributes } from '~/db/models/users';
import SearchIcon from '~/icons/search';
import FormField from '../common/FormField';
import UserListItem from './UserListItem';


interface UserSearchDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSelect: (user: UserAttributes) => void;
}

function useCloseOnPressEscape(open: boolean, onClose: () => void) {
  // onClose might be unstable (change on each render).
  // We ensure to always call the last value.

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (open) {
      const keyUpHandler = (e: KeyboardEvent) => {
        if (e.code === 'Escape') onCloseRef.current?.();
      };
      window.addEventListener('keyup', keyUpHandler, true);

      return () => window.removeEventListener('keyup', keyUpHandler);
    }
  }, [open]);
}

export default function UserSearchDialog(
  { title, open, onClose, onSelect }: UserSearchDialogProps
) {
  // Store the current value of `searchQuery` in `searchQueryRef`.
  // Request completion only triggers update for the latest search.

  const [searchQuery, setSearchQuery] = useState('');
  const [match, setMatch] = useState<UserAttributes[] | null>(null);
  const searchQueryRef = useRef('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  });

  useEffect(() => {
    if (searchQuery === '' || searchQuery === '@') {
      startTransition(() => setMatch(null));
      return;
    }

    const usp = new URLSearchParams({ q: searchQuery });
    axios.get<UserAttributes[]>(`/api/users/search?${usp.toString()}`).then(res => {
      if (searchQuery === searchQueryRef.current) {
        startTransition(() => setMatch(res.data));
      }
    });
  }, [searchQuery]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      inputRef.current?.focus();
    }
  }, [open]);

  useCloseOnPressEscape(open, onClose);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={clsx(
        'flex absolute inset-0 z-10 bg-black/20 flex items-center justify-center',
        open || 'hidden'
      )}
    >
      <div className="max-w-md w-full h-4/5 max-h-full rounded-md shadow-z24 bg-white flex flex-col">
        <h1 className="text-2xl mx-4 my-3">{title}</h1>
        <main className="p-4 pt-0 flex-auto overflow-y-hidden flex flex-col">
          <FormField
            placeholder="Search user" autoFocus
            startIcon={({ focus }) => <SearchIcon className={clsx(focus || 'opacity-50')} />}
            helperText="Type 'John Doe' or '@johndoe'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={inputRef}
          />

          {match != null
            ? (
              <ul className="overflow-y-auto grow-0 p-1">
                {match.map(user => (
                  <UserListItem
                    key={user.id} user={user}
                    className="border-slate-200 rounded-full cursor-default hover:bg-gray-100"
                    onClick={() => onSelect(user)}
                  />
                ))}
              </ul>
            ) : <p className="text-3xl text-gray-300">Enter search string</p>
          }
        </main>
      </div>
    </div>
  );
}
