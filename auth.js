const jwt = require("jsonwebtoken")
const cle = require('./server');

module.exports = () => {
    return (req, res, next) => {
        
        const token = req.cookies.token;
        console.log(token)
        if (token == null) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        jwt.verify(token, cle.getSecretKey().toString(), (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token invalide' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
}