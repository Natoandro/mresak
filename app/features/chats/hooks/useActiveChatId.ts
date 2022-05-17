import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useMemo } from 'react';

interface Query extends ParsedUrlQuery {
  chatId: string;
}

const parseParams = ({ chatId }: Query) => ({
  chatId: parseInt(chatId, 10),
});

export default function useActiveChatId() {
  const router = useRouter();
  const activeChatId = useMemo(() => (
    parseParams(router.query as Query).chatId
  ), [router.query]);
  return activeChatId;
}
