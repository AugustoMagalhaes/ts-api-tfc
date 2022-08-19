import * as bcrypt from 'bcryptjs';

class DecryptHandler {
  public static async decrypt(password: string, hash: string) {
    const comparison = await bcrypt.compare(password, hash).then((res: boolean) => res);
    return comparison;
  }
}

export default DecryptHandler;
