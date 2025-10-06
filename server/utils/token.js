import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            is2FAEnabled: user.is2FAEnabled
        },
        secretKey,
        { expiresIn: "1d" }
    );
    return token;
}