var jwt = require('jsonwebtoken')
var config = require('../config')
module.exports = function (req, res, next) {
    try {
        var token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, config.JWT_KEY)
        req.userData = decoded
        switch (req.userData.rank) {
            case 'moderator':
                console.log('Authenticated user!'.green)
                next()
                break

            default:
                res.status(401).json({
                    MESSAGE: 'Insufficient permissions!'
                })
        }
    } catch (error) {
        console.log(error.message.red)
        return res.status(401).json({
            MESSAGE: 'Authetication failed!'
        })
    }
}