import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RUserAttributes } from '~/db/models/users';
import { ButtonLink } from '../common/Button';
import UserListItem from '../users/UserListItem';
import Layout from './Layout';

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
          <Link key={user.login} href={`/admin/users/${user.id}`}>
            <UserListItem
              user={user}
              className="border-b first:border-t hover:bg-slate-100 cursor-pointer"
            />
          </Link>
        ))}
      </ul>
    </Layout>
  );
}
