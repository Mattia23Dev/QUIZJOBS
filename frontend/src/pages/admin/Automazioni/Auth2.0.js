import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { autenticaGoogleReact } from '../../../apicalls/users';
import { useSelector } from 'react-redux';

export const Auth20Gmail = () => {
    const CLIENT_ID = '321609978941-q9opjlcaol9ge415933dsi9r9j9i6ua6.apps.googleusercontent.com' //SKILLTEST '830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com';
    const REDIRECT_URI = 'http://localhost:3000/googleAuth';
    const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

    const generateAuthUrl = () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${CLIENT_ID}&` +
            `redirect_uri=${REDIRECT_URI}&` +
            `response_type=code&` +
            `scope=${SCOPE}&` +
            `access_type=offline`;

        window.location.href = authUrl;
    };

    return (
        <div>
            <button onClick={generateAuthUrl}>Autentica con Google</button>
        </div>
    );
}
export const CallbackComponentGoogle = () => {
    const location = useLocation();
    const user = useSelector(state=>state.users.user)

    useEffect(() => {
        async function fetchData(){
            const query = new URLSearchParams(location.search);
            const code = query.get('code');
            console.log(code)

            if (code) {
                try {
                    const data = await autenticaGoogleReact(code, user._id);
                    console.log(data)
                    if (data.status === 200) {
                        localStorage.setItem('accessToken', data.ACCESS_TOKEN);
                        localStorage.setItem('refreshToken', data.REFRESH_TOKEN);
                    }  
                } catch (error) {
                    console.error(error)
                }
            } else {
                console.log('Nessun codice')
            }         
        }
        fetchData()
    }, [location.search]);

    return (
        <div>
            <h1>Stiamo autenticando...</h1>
        </div>
    );
};

export const Linkedin = () => {
    return (
      <div>Auth2.0</div>
    )
}

export const Outlook = () => {
    return (
      <div>Auth2.0</div>
    )
}

