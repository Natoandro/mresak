import { SessionData } from 'next-session/lib/types';
import { Session } from '~/db/models/sessions';

export default class SessionStore {
  constructor(private sessions: typeof Session) { }

  async get(sid: string): Promise<SessionData | null> {
    try {
      const row = await this.sessions.findOne({ where: { sid } });
      if (row == null) return null;
      const sessData: SessionData = JSON.parse(row.sess);
      // TODO: check expired
      return sessData;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async set(sid: string, sessionData: SessionData) {
    await this.sessions.upsert({ sid: sid, sess: JSON.stringify(sessionData) });
  }

  async destroy(sid: string) {
    await this.sessions.destroy({ where: { sid } });
  }

  async touch(sid: string, sessionData: SessionData) {
    this.sessions.update({
      sess: JSON.stringify(sessionData)
    }, { where: { sid } });
  }
}
