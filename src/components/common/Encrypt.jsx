import CryptoJS from "crypto-js";
function encrypt(key) {    
    return CryptoJS.AES.encrypt(key,process.env.VITE_ENKEY).toString();
}
export default encrypt;