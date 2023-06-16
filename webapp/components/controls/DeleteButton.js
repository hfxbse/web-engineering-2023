import {authorizationHeader} from "/Session.js";
import {currentEntryPath, parentDirectoryURL} from "/Path.js";
import '/components/controls/ControlElement.js'
import '/components/error/ErrorDialog.js'
import router from "/router/Router.js";

export default class DeleteButton extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link rel="stylesheet" href="/components/controls/controls.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <button>
                <control-element class="control">
                    <link rel="stylesheet" href="/components/controls/controls.css">
                    <span class="material-symbols-outlined icon">delete</span>
                </control-element>
            </button>

            <error-dialog></error-dialog>
            
            <style>
                button {
                    padding: 0;
                }
            </style>
        `

        const controlElement = shadow.querySelector('control-element')
        const errorDialog = shadow.querySelector('error-dialog')
        const button = shadow.querySelector('button')

        button.addEventListener('click', async () => {
            button.setAttribute('disabled', 'disabled')
            controlElement.setAttribute('working', 'working')

            try {
                await this.deleteEntry()
            } catch (e) {
                errorDialog.innerText = e.message
                errorDialog.showModal()
            }

            controlElement.removeAttribute('working')
            button.removeAttribute('disabled')
        })
    }

    async deleteEntry() {
        let response

        let fileName = currentEntryPath().split('/')
        fileName = fileName[fileName.length - 1]

        try {
            response = await fetch(`http://localhost:8080/${currentEntryPath()}`, {
                method: 'DELETE',
                ...authorizationHeader()
            })
        } catch (e) {
            throw {message: `Could not delete ${fileName}.`}
        }

        if (!response.ok) {
            throw {message: `Failed to delete ${fileName}.`}
        }

        router.push(parentDirectoryURL())
    }
}

customElements.define('delete-button', DeleteButton)
