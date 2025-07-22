import JWT from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (user) => {
    const payload = { id: user.id };
    const secretKey = process.env.AUTH_SECRET;
    const expiration = process.env.JWT_EXPIRATION;
    // return JWT.sign(payload, secretKey);
return JWT.sign(payload, secretKey);

}

// export const verifyJWTToken = (req, res, next) => {
//     try {
//         log.info("verifyJWTToken", req.headers);
//         const token = 'Bearer ' + req.headers.authorization.split(' ')[1];
//         console.log("verifyJWTToken - token - ", token);
//         if (!token) {
//             return res.status(403).send("A token is required for authentication");
//         }
//         const decoded = JWT.verify(token, process.env.AUTH_SECRET);
//         console.log(decoded);
//     } catch (err) {
//         return res.status(401).send("Invalid Token");
//     }
//     return next();
// }

export const verifyJWTToken = (req, res, next) => {
    try {
        // Ensure the Authorization header is present
        const authorizationHeader = req.headers.authorization;
        // console.log("verifyJWTToken", authorizationHeader);
        if (!authorizationHeader) {
            return res.status(403).send("A token is required for authentication");
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
        // console.log("verifyJWTToken - token - ", token);
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const decoded = JWT.verify(token, process.env.AUTH_SECRET);
        // console.log("Decoded token:", decoded);
        // Optionally, set user information in the request
        req.user = decoded;
    } catch (err) {
        console.log("Error during token verification:", err);
        return res.status(401).send("Invalid Token");
    }

    return next();
}
