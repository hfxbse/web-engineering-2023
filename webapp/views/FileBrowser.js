import {authorizationHeader, sessionData, validateSession} from "/Session.js";
import '/components/SpinnerIndicator.js'
import '/components/ErrorMessage.js'
import '/components/FileList.js'
import '/components/FileElement.js'
import '/components/MediaView.js'
import '/components/TextEditor.js'
import '/components/PathView.js'
import '/components/controls/LogoutButton.js'
import '/components/controls/DownloadButton.js'
import '/components/controls/UploadButton.js'

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
            <path-view>
                <logout-button></logout-button>
            </path-view>
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    
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
                
                :host > :not(path-view) {
                    flex-grow: 1;
                    flex-shrink: 1;
                }
                
                path-view {
                    bottom: 0;
                    position: sticky;
                    
                    background: white;
                    border-top: 1px solid black;
                    padding: calc(var(--padding) / 2) var(--padding);
                }
            </style>
        `

        const placeholder = shadow.querySelector('.placeholder')
        const pathView = shadow.querySelector('path-view')

        this.fetchContent()
            .then((content) => {
                if (content) this.displayContent(shadow, placeholder, content, pathView)
            })
            .catch((e) => this.displayError(placeholder, e))
    }

    addControl(pathView, control) {
        pathView.insertBefore(control, pathView.firstElementChild)
    }

    displayDirectory(list, content) {
        Array.from(list.children).forEach(child => list.removeChild(child))

        content.content.forEach((entry) => {
            const item = document.createElement('file-element')
            item.setAttribute('file', JSON.stringify(entry))

            list.appendChild(item)
        })
    }

    displayContent(shadow, placeholder, content, pathView) {
        let element;

        if (content.type === 'directory') {
            element = document.createElement(`file-list`)

            this.displayDirectory(element, content)

            const uploadButton = document.createElement('upload-button')
            uploadButton.addEventListener('uploaded', () => {
                this.fetchContent()
                    .then((content) => this.displayDirectory(element, content))
                    .catch(console.dir)     // TODO
            })

            this.addControl(pathView, uploadButton)
        } else {
            const downloadButton = document.createElement('download-button');
            downloadButton.setAttribute('href', content.content)
            this.addControl(pathView, downloadButton)

            if (/^(image|audio|video)\//.test(content.type)) {
                element = document.createElement('media-view')
                element.setAttribute('type', content.type)
            } else if (/^text\//.test(content.type)) {
                element = document.createElement('text-editor')
            } else {
                this.displayError(placeholder, {message: 'Preview not available.'})
                return
            }

            element.setAttribute('src', content.content)
        }

        if (element) shadow.insertBefore(element, placeholder)
        shadow.removeChild(placeholder)
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
        const response = await this.catchNetworkError(async () => {
            return await fetch(`http://localhost:8080/${this.path()}`, authorizationHeader());
        })

        if (!validateSession(response)) return;

        if (response.status === 500 && (await response.json()).error === 'file does not exist') {
            throw {message: 'File does not exits.'}
        }

        const contentType = response.headers.get('Content-Type')

        return await this.catchNetworkError(async () => {
            if (contentType.startsWith('text/html'))
                return {type: 'directory', content: await response.json()}
            else
                return {
                    type: contentType.startsWith('text/plain') ? 'text/plain' : contentType,
                    content: URL.createObjectURL(await response.blob())
                }
        })
    }

    async catchNetworkError(runner) {
        try {
            return await runner();
        } catch (e) {
            throw {message: "Could not load directory due to a network error.", reason: e}
        }
    }
}

customElements.define('file-browser', FileBrowser)
