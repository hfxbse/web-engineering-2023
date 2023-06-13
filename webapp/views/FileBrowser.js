import {authorizationHeader, sessionData, validateSession} from "/Session.js";
import '/components/SpinnerIndicator.js'

export function userRoot() {
    return `/@${sessionData().user}`
}

export default class FileBrowser extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <div class="loading">
                <h2>Loading your files…</h2>
                <spinning-indicator></spinning-indicator>            
            </div>
            
            <style>
                :host {
                    display: block;
                    height: 100vh;
                    width: 100vw;
                }
            
                .loading {
                    height: 100%;
                    width: 100%;
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--padding);
                }
            </style>
        `

        const loadingPlaceholder = shadow.querySelector('.loading')

        this.fetchDirectory()
            .then(() => {
                shadow.removeChild(loadingPlaceholder)
            })
            .catch(() => {
                shadow.removeChild(loadingPlaceholder)
            })
    }

    path() {
        let path = location.pathname.slice(userRoot().length)
        if (path.startsWith('/')) path = path.slice(1)

        return path
    }

    async fetchDirectory() {
        const response = await fetch(`http://localhost:8080/${this.path()}`, authorizationHeader())
        if (!validateSession(response)) return;

        console.log(response)
    }
}

customElements.define('file-browser', FileBrowser)
