const jwt = require('jsonwebtoken')

const str = jwt.sign({
    sid:10,
    account:'shinder'
},'1uh23vq23we123kn123fiq2r1l1o2k3d')

console.log(str);