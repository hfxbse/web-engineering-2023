import {authorizationHeader, sessionData, validateSession} from "/Session.js";
import {currentEntryPath} from "/Path.js";
import '/components/SpinnerIndicator.js'
import '/components/error/ErrorMessage.js'
import '/components/FileList.js'
import '/components/FileElement.js'
import '/components/MediaView.js'
import '/components/TextEditor.js'
import '/components/PathView.js'
import '/components/controls/LogoutButton.js'
import '/components/controls/DownloadButton.js'
import '/components/controls/UploadButton.js'
import '/components/controls/DeleteButton.js'
import '/components/controls/SaveButton.js'
import '/components/controls/UndoButton.js'
import '/components/controls/CreateButton.js'

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

    contentToBlob(content) {
        return new Blob([content.content], {type: content.type})
    }

    displayText(pathView, downloadButton, content) {
        const textEditor = document.createElement('text-editor')
        textEditor.value = content.content

        textEditor.addEventListener('input', () => {
            this.textControls({textEditor, downloadButton, pathView, content})
        }, {once: true})

        return textEditor
    }

    textControls({textEditor, downloadButton, pathView, content}) {
        const undoButton = document.createElement('undo-button')

        const saveButton = document.createElement('save-button')
        saveButton.setAttribute('type', content.type)
        saveButton.value = this.contentToBlob(content)

        const removeControls = (value) => {
            pathView.removeChild(undoButton)
            pathView.removeChild(saveButton)

            textEditor.addEventListener('input', () => {
                this.textControls({
                    textEditor,
                    downloadButton,
                    pathView,
                    content: {
                        ...content,
                        content: value
                    }
                })
            }, {once: true})
        }

        saveButton.addEventListener('saved', () => removeControls(textEditor.value))
        undoButton.addEventListener('click', () => {
            removeControls(content.content)
            textEditor.displayText(content.content)
        })

        textEditor.addEventListener('change', () => {
            const data = this.contentToBlob({...content.type, content: textEditor.value})

            saveButton.value = data
            downloadButton.setAttribute('href', URL.createObjectURL(data))
        })

        this.addControl(pathView, saveButton)
        this.addControl(pathView, undoButton)
    }

    displayContent(shadow, placeholder, content, pathView) {
        const directory = content.type === 'directory';

        let element = directory ?
            this.folderView(pathView, content) :
            this.fileView(pathView, placeholder, content)

        if (currentEntryPath().length > 0) {
            this.addControl(pathView, document.createElement('delete-button'))
        }

        if (directory) {
            const createButton =  document.createElement('create-button')
            createButton.addEventListener('created', () => this.updateContent(element))

            this.addControl(pathView, createButton)
        }

        if (!element) return

        shadow.insertBefore(element, placeholder)
        shadow.removeChild(placeholder)
    }

    displayError(placeholder, error) {
        Array.from(placeholder.children).forEach(child => placeholder.removeChild(child))

        const errorElement = document.createElement('error-message')
        errorElement.setAttribute('centered', 'centered')
        errorElement.innerText = error.message ?? 'An unexpected error occurred.'

        placeholder.appendChild(errorElement)
    }

    folderView(pathView, content) {
        const fileList = document.createElement(`file-list`)

        const uploadButton = document.createElement('upload-button')
        uploadButton.addEventListener('uploaded', () => this.updateContent(fileList))

        this.displayDirectory(fileList, content)
        this.addControl(pathView, uploadButton)

        return fileList
    }

    contentDownloadURL(content) {
        if (content.type.startsWith("text/")) {
            return URL.createObjectURL(
                new Blob([content.content], {type: content.type})
            )
        } else {
            return content.content
        }
    }

    fileView(pathView, placeholder, content) {
        const downloadButton = document.createElement('download-button');
        downloadButton.setAttribute('href', this.contentDownloadURL(content))
        this.addControl(pathView, downloadButton)

        let fileView
        if (/^(image|audio|video)\//.test(content.type)) {
            fileView = document.createElement('media-view')
            fileView.setAttribute('type', content.type)
        } else if (/^text\//.test(content.type)) {
            fileView = this.displayText(pathView, downloadButton, content)
        } else {
            this.displayError(placeholder, {message: 'Preview not available.'})
            return
        }

        fileView.setAttribute('src', content.content)
        return fileView;
    }

    async fetchContent() {
        const response = await this.catchNetworkError(async () => {
            return await fetch(`http://localhost:8080/${currentEntryPath()}`, authorizationHeader());
        })

        if (!validateSession(response)) return;

        if (response.status === 500 && (await response.json()).error === 'file does not exist') {
            throw {message: 'File does not exits.'}
        }

        const contentType = response.headers.get('Content-Type')

        return await this.catchNetworkError(async () => {
            if (contentType.startsWith('text/html'))
                return {type: 'directory', content: await response.json()}
            else if (contentType.startsWith('text/')) {
                return {
                    type: contentType,
                    content: await response.text()
                }
            } else {
                return {
                    type: contentType,
                    content: URL.createObjectURL(await response.blob())
                }
            }
        })
    }

    async catchNetworkError(runner) {
        try {
            return await runner();
        } catch (e) {
            throw {message: "Could not load entry due to a network error.", reason: e}
        }
    }

    async updateContent(element) {
        while (true) {
            try {
                const content = await this.fetchContent()
                this.displayDirectory(element, content)
                return
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }
    }
}

customElements.define('file-browser', FileBrowser)
