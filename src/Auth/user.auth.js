const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_secret);
        req.user = verified;
       return next();
    } catch (err) {
        res.status(400).send('unauthorized');
    }
};  

module.exports = auth;