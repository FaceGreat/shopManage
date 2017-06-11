/**
 * Created by Administrator on 2017/5/7.
 */
let crypto = require('crypto');
const key="751f621ea5c8f930";//加密的秘钥
const iv = '2624750004598718'; //加密的向量

module.exports = {
  /**
   * 加密方法
   * @param data     需要加密的数据
   * @returns string
   */
  encrypt :  function (data) {
    cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
  },
  /**
   * 解密方法
   * @param crypted  密文
   * @returns string
   */
  decrypt:  function (crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    let  decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let  decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }

};
