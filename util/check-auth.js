const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config')

//認証用モジュール
module.exports = (context) => {
    //引数から認証用ヘッダーを取得
    const authHeader = context.req.headers.authorization;

    //authHeaderがあったら？
    if (authHeader) {
        //splitしてtokenを取得
        const token = authHeader.split('Bearer ')[1];
        
        //tokenがあったら？
        if (token) {
            //tokenとserect keyを使って認証
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            //ダメだったら認証エラー
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        //ダメだったらトークンの形式エラー
        }throw new Error("Authentiation token must be `Bearer [token]");
    }
    //ダメだったらトークン不在エラー
    throw new Error('Authentication header must be provided');
}