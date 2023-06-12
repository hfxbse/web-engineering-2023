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

export async function sessionActive() {
    const session = sessionData();

    if (!session.token || !session.user) return false;

    try {
        const response = await fetch('http://localhost:8080', authorizationHeader())
        return response.ok;
    } catch (e) {
        console.error(e)
        return false
    }
}
