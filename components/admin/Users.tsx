import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserAttributes } from '~/db/models/users';
import Button from '../common/Button';

interface UserListItemProps {
  user: UserAttributes;
}

function UserListItem({ user }: UserListItemProps) {
  return (
    <li className="flex border-b first:border-t px-4 py-2 flex flex-col">
      <span>{user.name}</span>
      <span className="text-gray-500 text-sm">{user.login}</span>
    </li>
  );
}

export default function Users() {
  console.log('render');
  const [users, setUsers] = useState<UserAttributes[] | null>(null);

  useEffect(() => {
    // TODO: security: cookie auth
    axios.get<UserAttributes[]>('/api/admin/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('error');
      });
  }, []);

  return (
    <div className="h-screen flex flex-col relative">
      <header className="bg-blue-500 text-white px-4 py-2 flex">
        <h1 className="text-4xl italic">M&apos;Resak</h1>
        <h2 className="text-4xl ml-4 opacity-70">Admin</h2>
      </header>
      <main className="grow max-w-screen-sm w-full mx-auto">
        <h3 className="text-3xl bold py-4">User management</h3>
        <div className="mt-2 mb-4">
          <Button variant="outlined">New user</Button>
        </div>

        <ul>
          {users && users.map(user => (
            <UserListItem key={user.login} user={user} />
          ))}
        </ul>
      </main>
    </div>
  );
}
