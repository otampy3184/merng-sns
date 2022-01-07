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

//AuthProvider作成
function AuthProvider(props) {
    const [state, disatch] = useReducer(authReducer, initialState);

    //loginの場合はlocalstorage上にjwtTokenをセット
    function login(userData) {
        localStorage.setItem('jwtToken', userData.token);
        dispatchEvent({
            type: 'LOGIN',
            payload: userData
        });
    }

    //logoutの場合はlocalstrage上のjwttokenを削除
    function logout(){
        localStorage.removeItem('jwtToken');
        dispatch({ type: 'LOGOUT'});
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    );
}

export { AuthContext, AuthProvider};
