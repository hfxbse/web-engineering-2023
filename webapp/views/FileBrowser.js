import {authorizationHeader, sessionData, validateSession} from "/Session.js";
import '/components/SpinnerIndicator.js'
import '/components/ErrorMessage.js'

export function userRoot() {
    return `/@${sessionData().user}`
}

export default class FileBrowser extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <div class="placeholder">
                <h2>Loading your files…</h2>
                <spinning-indicator></spinning-indicator>            
            </div>
            
            <style>
                :host {
                    display: block;
                    height: 100vh;
                    width: 100vw;
                }
            
                .placeholder {
                    height: 100%;
                    width: 100%;
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--padding);
                }
            </style>
        `

        const placeholder = shadow.querySelector('.placeholder')

        this.fetchDirectory()
            .then(() => shadow.removeChild(placeholder))
            .catch((e) => this.displayError(placeholder, e))
    }

    displayError(placeholder, error) {
        Array.from(placeholder.children).forEach(child => placeholder.removeChild(child))

        const errorElement = document.createElement('error-message')
        errorElement.setAttribute('message', error.message ?? 'An unexpected error occurred.')

        placeholder.appendChild(errorElement)
    }

    path() {
        let path = location.pathname.slice(userRoot().length)
        if (path.startsWith('/')) path = path.slice(1)

        return path
    }

    async fetchDirectory() {
        try {
            const response = await fetch(`http://localhost:8080/${this.path()}`, authorizationHeader())
            if (!validateSession(response)) return;

            return await response.json();
        } catch (e) {
            throw {message: "Could not load directory due to a network error."}
        }

    }
}

customElements.define('file-browser', FileBrowser)
