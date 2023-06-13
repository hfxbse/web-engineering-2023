import router from "/router/Router.js";

export function saveSession(user, token) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', user);
}

export function sessionData() {
    const token = sessionStorage.getItem('token')
    const user = sessionStorage.getItem('user')

    return {user, token}
}

export function authorizationHeader() {
    const {token, user} = sessionData();

    return {
        headers: {
            Authorization: `Basic ${btoa(`${user}:${token}`)}`
        }
    }
}

export function sessionActive() {
    const session = sessionData();
    return session.token && session.user;
}

export function validateSession(response,) {
    if (response.status === 401) {
        sessionStorage.clear()
        router.push(`/auth?redirect=${encodeURI(location.pathname + location.search)}`)

        return false
    }

    return true
}
