import bcrypt from 'bcrypt';

interface GenRandomPasswordResult {
  password: string;
  hash: string;
}

export async function genRandomPassword(): Promise<GenRandomPasswordResult> {
  // TODO: use crypto??
  const password = Math.random().toString(36).slice(2);
  const hash = await bcrypt.hash(password, 10);

  return { password, hash };
}
