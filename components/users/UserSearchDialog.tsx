import axios from 'axios';
import clsx from 'clsx';
import { ChangeEvent, forwardRef, useEffect, useRef, useState, useTransition } from 'react';
import { RUserAttributes } from '~/db/models/users';
import SearchIcon from '~/icons/search';
import FormField from '../common/FormField';


interface UserSearchDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

export default function UserSearchDialog({ title, open, onClose }: UserSearchDialogProps) {
  const [match, setMatch] = useState<RUserAttributes[] | null>(null);
  const [changeId, setChangeId] = useState(0);
  const changeIdRef = useRef(0);

  useEffect(() => {
    changeIdRef.current = changeId;
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (q === '' || q === '@') {
      startTransition(() => {
        setMatch(null);
        setChangeId(n => n + 1);
      });
    }

    const usp = new URLSearchParams({ q });
    const res = await axios.get<RUserAttributes[]>(`/api/users/search?${usp.toString()}`);
    if (changeId === changeIdRef.current) {
      startTransition(() => {
        setMatch(res.data);
        setChangeId(n => n + 1);
      });
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div
      onClick={() => onClose()}
      className={clsx(
        'flex absolute inset-0 z-10 bg-black/20 flex items-center justify-center',
        open || 'hidden'
      )}
    >
      <div className="max-w-md w-full h-1/2 max-h-full rounded-md shadow-2xl bg-white flex flex-col">
        <h1 className="text-2xl mx-4 my-3">{title}</h1>
        <main className="px-4 py-2">
          <FormField
            placeholder="Search user" autoFocus
            startIcon={({ focus }) => <SearchIcon className={clsx(focus || 'opacity-50')} />}
            helperText="Type 'John Doe' or '@johndoe'"
            onChange={handleChange}
            ref={inputRef}
          />
          {match != null
            ? match.map(user => (
              <li key={user.id}>{user.name}</li>
            ))
            : <p className="text-3xl text-gray-300">Enter search string</p>
          }
        </main>
      </div>
    </div>
  );
}
