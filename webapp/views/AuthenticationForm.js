import {saveSession} from "/Session.js";
import router from "/router/Router.js";
import "/components/error/ErrorMessage.js";
import "/components/SpinnerIndicator.js"

export default class AuthenticationForm extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <form>
                <label for="username" class="text-field-label">Username</label>
                <input type="text" id="username">
                
                <label for="password" class="text-field-label">Password</label>
                <input type="password" id="password">
                
                <div>
                    <error-message></error-message>
                    <div class="login">
                        <button id="submit">Login</button>
                    </div>
                </div>
            </form>
            
            <style>
                :host {
                    height: 100vh;
                    width: 100vw;
                    
                    display: grid;
                    align-items: center;
                    justify-content: center;
                }
            
                form {
                    display: flex;
                    flex-direction: column;
                    
                    width: 50ch;
                    max-width: calc(100vw - 2 * var(--padding));
                    container-type: inline-size;
                    
                    padding: var(--padding);
                }
                
                input {
                    margin-bottom: calc(var(--padding) / 2);
                }
                
                button {
                    color: #FFF;
                    background: var(--highlight-color);
                }
                
                div:not(.login) {
                    margin-top: calc(var(--padding) / 2);
                    
                    display: flex;
                    align-items: center;
                    gap: calc(var(--padding) / 2);
                }
                
                error-message {
                    flex: 1;
                    margin-left: calc(var(--padding) / 4);
                }
                
                error-message:empty {
                    visibility: hidden;
                }
                
                .login {
                    display: flex;
                    gap: calc(var(--padding) / 4);
                    align-items: center;
                }
                
                spinning-indicator {
                    opacity: 0.6;
                }
                
                @container (max-width: 40ch) {
                    div:not(.login) {
                        flex-direction: column-reverse;
                    }
                
                    .login {
                        width: 100%;
                        margin-bottom: calc(var(--padding) / 2);
                    }
                    
                    button {
                        flex: 1;
                    }
                    
                    error-message {
                        text-align: center;
                        margin: 0;
                    }
                }
            </style>
        `

        const usernameInput = shadow.querySelector("#username")
        const passwordInput = shadow.querySelector("#password")
        const loginButton = shadow.querySelector("#submit")
        const errorBanner = shadow.querySelector("error-message")

        loginButton.onclick = async (event) => {
            event.preventDefault()

            const spinner = document.createElement('spinning-indicator')
            loginButton.disabled = true
            loginButton.parentElement.insertBefore(spinner, loginButton)

            try {
                await this.login(usernameInput.value, passwordInput.value)
                router.push(this.redirect())
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 200))

                loginButton.parentElement.removeChild(spinner)
                loginButton.disabled = false
                errorBanner.innerText = e.message
            }
        }
    }

    redirect() {
        const parameters = new URLSearchParams(location.search)
        return parameters.has('redirect') ? parameters.get('redirect') : '/'
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
            await this.networkExceptionHandler(async () => saveSession(
                username,
                (await response.json()).token)
            )
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
