import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

//初期StateはNull
const initialState = {
    user: null
};

//localStrageのjwtTokenの有効期限を確認
if (localStorage.getItem('jwtToken')) {
    const decodeToken = jwtDecode(localStorage.getItem('jwtToken'));

    if (decodeToken.exp * 1000 < DataTransfer.now()) {
        localStorage.removeItem('jwtToken');
    } else{
        initialState.user = decodeToken;
    }
}

//AuthContextのオブジェクト
const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
});

//actionタイプによって処理を振り分け
function authReducer(state, action) {
    switch (action.type){
        case 'LOGIN' :
            return {
                ...state,
                user: action.payload
            };
        case 'LOGOUT' :
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}


