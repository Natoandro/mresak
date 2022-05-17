import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { store } from '~/app/store';
import { Provider } from 'react-redux';
import { CurrentUserProvider } from '@/users/contexts/CurrentUser';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CurrentUserProvider>
        <Component {...pageProps} />
      </CurrentUserProvider>
    </Provider>
  );
}

export default MyApp;
