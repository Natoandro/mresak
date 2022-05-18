import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { store } from '~/app/store';
import { Provider } from 'react-redux';
import { UserAttributes } from '~/db/models/users';
import { useEffect } from 'react';
import { setUser } from '~/app/features/users/userSlice';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AppPropsExt {
  user?: UserAttributes | true;
  redirect?: string;
}

function MyApp({ Component, pageProps, user, redirect }: AppProps & AppPropsExt) {
  const router = useRouter();
  useEffect(() => {
    if (user != null) {
      if (user === true) {
        axios.get<UserAttributes>('/api/me')
          .then(({ data: user }) => store.dispatch(setUser(user)));
      } else {
        store.dispatch(setUser(user));
      }
    }
  }, [user]);

  useEffect(() => {
    if (redirect) {
      router.replace(redirect);
    }
  }, [redirect, router]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext): Promise<AppPropsExt> => {
  const { pathname } = ctx.router;
  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return {};
  }

  if (ctx.ctx.req != null) {
    // first load (called on server)
    const cookie = ctx.ctx.req.headers['cookie'];
    // TODO replace by env.PORT
    const res = await fetch('http://localhost:3000/api/me', {
      headers: cookie != null ? { cookie } : {}
    });
    if (res.status === 200) {
      const user: UserAttributes = await res.json();
      return { user };
    } else {
      const usp = new URLSearchParams({ next: ctx.router.asPath });
      return { redirect: `/login?${usp.toString()}` };
    }
  }

  if (store.getState().user.current == null) {
    return { user: true };
  } else {
    return {};
  }
};

export default MyApp;
