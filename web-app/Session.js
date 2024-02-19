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

export function clearSession() {
    sessionStorage.clear()
    router.push(`/auth?redirect=${encodeURI(location.pathname + location.search)}`)
}

export function validateSession(response) {
    if (response.status === 401) {
        clearSession()

        return false
    }

    return true
}

export async function invalidateSession() {
    while (true) {
        try {
            const response = await fetch('http://localhost:8080/logout', authorizationHeader())
            if (!validateSession(response)) return

            clearSession()
            return
        } catch (e) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }
}
