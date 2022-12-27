import CryptoJS from "crypto-js";
function encrypt(key) {    
    return CryptoJS.AES.encrypt(key,process.env.REACT_APP_ENKEY).toString();
}
export default encrypt;