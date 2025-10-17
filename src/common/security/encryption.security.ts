import CryptoJs from 'crypto-js';

export const encrypt = (data: string): string => {
  return CryptoJs.AES.encrypt(
    data,
    process.env.ENCRYPTION_KEY as string,
  ).toString();
};

export const decrypt = (data: string): string => {
  return CryptoJs.AES.decrypt(
    data,
    process.env.ENCRYPTION_KEY as string,
  ).toString(CryptoJs.enc.Utf8);
};
