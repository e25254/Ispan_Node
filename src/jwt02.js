const jwt = require('jsonwebtoken')

const myToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOjEwLCJhY2NvdW50Ijoic2hpbmRlciIsImlhdCI6MTY2NzgwODMzOX0.ddP60EYaIEM7XyyuWJxq7KObEtLBJhLRUUnwUOY1z8g'

const payload = jwt.verify(myToken,'1uh23vq23we123kn123fiq2r1l1o2k3d')

console.log(payload);