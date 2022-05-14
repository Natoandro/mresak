import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RUserAttributes, UserAttributes } from '~/db/models/users';
import { ButtonLink } from '../common/Button';
import Layout from './Layout';

interface UserListItemProps {
  user: RUserAttributes;
}

function UserListItem({ user }: UserListItemProps) {
  return (
    <Link href={`/admin/users/${user.id}`}>
      <li className="flex border-b first:border-t px-4 py-2 flex flex-col hover:bg-slate-100 cursor-pointer">
        <span>{user.name}</span>
        <span className="text-gray-500 text-sm">@{user.login}</span>
      </li>
    </Link>
  );
}

export default function Users() {
  console.log('render');
  const [users, setUsers] = useState<RUserAttributes[] | null>(null);

  useEffect(() => {
    // TODO: security: cookie auth
    axios.get<RUserAttributes[]>('/api/admin/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('error');
      });
  }, []);

  return (
    <Layout>
      <h3 className="text-3xl bold py-4">User management</h3>
      <div className="mt-2 mb-4">
        <ButtonLink href="/admin/users/new" variant="outlined">New user</ButtonLink>
      </div>

      <ul>
        {users && users.map(user => (
          <UserListItem key={user.login} user={user} />
        ))}
      </ul>
    </Layout>
  );
}
