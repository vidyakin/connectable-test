const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        let result;
        if (authorizationHeader) {
            //const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const token = req.headers.authorization;
            try {
                result = jwt.verify(token, process.env.JWT_SECRET);
                req.decoded = result;
                next();
            } catch (err) {
                throw new Error(err);
            }
        } else {
            result = {
                error: `Authentication error. Token required.`,
                status: 401
            };
            res.status(401).send(result);
        }
};

// Вывод объекта с защитой от цикличных ключей
module.exports.jsonstr = obj => {
    let cache = []
    let strReq = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 2)
    cache = null;
    return strReq
}