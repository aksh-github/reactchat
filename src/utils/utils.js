import CryptoJS from "crypto-js";

// const kp = "84cfeb6";
const kp = "30269de";

export const encryptText = (plainData, key) => {
  return CryptoJS.AES.encrypt(plainData, key).toString();
};

export const decryptText = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
