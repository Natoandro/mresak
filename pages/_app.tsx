import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { store } from '~/app/store';
import { Provider } from 'react-redux';
import App from 'next/app';
import { UserAttributes } from '~/db/models/users';
import { setCurrentUser } from '~/lib/reqCurrentUser';
import CurrentUserContext from '~/contexts/currentUser';
import { useState } from 'react';

interface AppPropsExt {
  currentUser: UserAttributes | null;
}

function MyApp({ Component, pageProps, currentUser }: AppProps & AppPropsExt) {
  const [user, setUser] = useState(currentUser);

  return (
    <Provider store={store}>
      <CurrentUserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </CurrentUserContext.Provider>
    </Provider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const { req } = ctx.ctx;
  let currentUser = null;
  if (req) { // first load
    const res = await fetch('http://localhost:3000/api/me', {
      headers: {
        cookie: ctx.ctx.req!.headers['cookie'] as string,
      }
    });
    if (res.status === 200) {
      const user: UserAttributes = await res.json();
      setCurrentUser(req, user);
      currentUser = user;
    }
  }
  return { ...App.getInitialProps(ctx), currentUser };
};

export default MyApp;
