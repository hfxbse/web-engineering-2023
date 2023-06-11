import {saveSession} from "../Session.js";

export default class AuthenticationForm extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <!--suppress HtmlUnknownTarget -->
            <link rel="stylesheet" href="./base.css">
            <form>
                <label for="username-" class="text-field-label">Username</label>
                <input type="text" id="username-">
                
                <label for="password" class="text-field-label">Password</label>
                <input type="password" id="password">
                
                <button id="submit">Login</button>
            </form>
            
            <style>
                :host {
                    display: block;
                }
            
                form {
                    display: flex;
                    flex-direction: column;
                }
                
                input {
                    margin-top: calc(var(--padding) / 4);
                    margin-bottom: calc(var(--padding) / 2);
                }
                
                button {
                    color: #FFF;
                    background: var(--highlight-color);
                }
            </style>
        `

        const usernameInput = shadow.querySelector("#username-")
        const passwordInput = shadow.querySelector("#password")
        const loginButton = shadow.querySelector("#submit")

        loginButton.onclick = async (event) => {
            event.preventDefault()

            loginButton.disabled = true
            loginButton.innerText = "Logging in…"

            await this.login(usernameInput.value, passwordInput.value)

            loginButton.innerText = "Login"
            loginButton.disabled = false
        }
    }

    async networkExceptionHandler(runner) {
        try {
            await runner()
        } catch (e) {
            throw new LoginException(
                "Could not log you in.",
                e
            )
        }
    }

    async login(username, password) {
        const credentials = new FormData();
        credentials.append("username", username)
        credentials.append("password", password)

        let response;

        await this.networkExceptionHandler(async () => {
            response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                body: credentials
            })
        })

        if (response.status === 200) {
            await this.networkExceptionHandler(async () => saveSession((await response.json()).token))
        } else if (response.status === 401) {
            throw new LoginException("Username or password mismatched.", response)
        } else {
            throw new LoginException("An unexpected error occurred while trying to login.", response)
        }
    }
}

class LoginException {
    message;
    reason

    constructor(message, reason) {
        this.message = message;
        this.reason = reason;
    }
}

customElements.define('authentication-form', AuthenticationForm)
