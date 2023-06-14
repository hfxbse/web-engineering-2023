import {authorizationHeader, sessionData, validateSession} from "/Session.js";
import '/components/SpinnerIndicator.js'
import '/components/ErrorMessage.js'
import '/components/FileList.js'
import '/components/FileElement.js'
import '/components/MediaView.js'
import '/components/TextEditor.js'

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

        this.fetchContent()
            .then((content) => this.displayContent(shadow, placeholder, content))
            .catch((e) => this.displayError(placeholder, e))
    }

    displayContent(shadow, placeholder, content) {
        shadow.removeChild(placeholder)

        let element;

        if (content.type === 'directory') {
            content = content.content

            element = document.createElement(`file-list`)
            content.forEach((entry) => {
                const item = document.createElement('file-element')
                item.setAttribute('file', JSON.stringify(entry))

                element.appendChild(item)
            })
        } else if (/^(image|audio|video)\//.test(content.type)) {
            element = document.createElement('media-view')
            element.setAttribute('type', content.type)
            element.setAttribute('src', content.content)
        } else if (/^text\//.test(content.type)) {
            element = document.createElement('text-editor')
            element.setAttribute('src', content.content)
        }

        shadow.appendChild(element)
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

    async fetchContent() {
        try {
            const response = await fetch(`http://localhost:8080/${this.path()}`, authorizationHeader())
            if (!validateSession(response)) return;

            const contentType = response.headers.get('Content-Type')

            if (contentType.startsWith('text/html'))
                return {type: 'directory', content: await response.json()}
            else
                return {
                    type: contentType.startsWith('text/plain') ? 'text/plain' : contentType,
                    content: URL.createObjectURL(await response.blob())
                }
        } catch (e) {
            throw {message: "Could not load directory due to a network error."}
        }

    }
}

customElements.define('file-browser', FileBrowser)
