import crypto from 'crypto';

const ENC_KEY = process.env.REACT_APP_ENCRYPTION_KEY_PLAIN; // Encryption key
const IV = process.env.REACT_APP_ENCRYPTION_IV; // Initialisation vector

const ENC_KEY_HASH = crypto.createHash('md5').update(ENC_KEY, 'utf-8').digest('hex');

export const encrypt = (val) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY_HASH, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY_HASH, IV);
  const decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
