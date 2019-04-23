// crypto 用于签名或加密
const crypto = require('crypto')
// 密钥
const KEY = "!s@o#l$y%a^0&8*0(8)..."

let myCrypto = {}

// 哈希算法签名
// @prama {String} hash 哈希算法，如"sha1" "md5" "sha256"
// @parma {String | Number} id  需要签名的字符串
// @parma {String} key 需要加的盐，可选，默认为 KEY
// @return {String} 签名后的字符串
myCrypto.hash = (hash, id, key = KEY) => {
  // 签名方式，指定算法和密钥
  let sign = crypto.createHmac(hash, key)
  // 签名目标字符串
  sign.update(id + '')
  // 返回签名格式，'hex'十六进制
  return sign.digest('hex')
}

module.exports = myCrypto
