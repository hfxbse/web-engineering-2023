import {authorizationHeader, validateSession} from "/Session.js";
import '/components/controls/ControlElement.js'
import {currentEntryName, currentEntryPath} from "/Path.js";

export default class SaveButton extends HTMLElement {
    static get observedAttributes() {
        return ['src', 'type']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;
    }

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
                    <span class="material-symbols-outlined icon">save</span>
                </control-element>
            </button>
            
            <error-dialog></error-dialog>
            
            <style>
                button {
                    padding: 0;
                }
            </style>
        `

        const button = shadow.querySelector('button')
        const controlElement = shadow.querySelector('control-element')
        const errorDialog = shadow.querySelector('error-dialog')

        button.addEventListener('click', async () => {
            controlElement.setAttribute('working', 'working')
            button.setAttribute('disabled', 'disabled')

            try {
                await this.overwrite()
            } catch (e) {
                errorDialog.innerText = e.message
                errorDialog.showModal()
            }

            button.removeAttribute('disabled')
            controlElement.removeAttribute('working')
        })
    }

    async overwrite() {
        let response
        try {
            const content = new File(
                [await (await fetch(this.src)).blob()],
                currentEntryName(),
                {type: this.type}
            )

            const form = new FormData()
            form.append('newFile', content)

            response = await fetch(`http://localhost:8080/${currentEntryPath()}`, {
                method: 'POST',
                body: form,
                ...authorizationHeader()
            })
        } catch (e) {
            throw {message: `Could not save ${currentEntryName()}.`}
        }

        if (!validateSession(response)) return
        if (!response.ok) throw {message: `Failed to save ${currentEntryName()}.`}

        this.dispatchEvent(new CustomEvent('uploaded'))
    }
}

customElements.define('save-button', SaveButton)
