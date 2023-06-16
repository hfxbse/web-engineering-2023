import {authorizationHeader} from "/Session.js";
import '/components/controls/ControlElement.js'
import '/components/ErrorMessage.js'

export default class UploadButton extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link rel="stylesheet" href="/components/controls/controls.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <label for="upload">
                <control-element class="control">
                    <link rel="stylesheet" href="/components/controls/controls.css">
                    <span class="material-symbols-outlined icon">upload</span>
                </control-element>
            </label>
            <input type="file" id="upload">
            <dialog>
                <error-message></error-message>
                <button>Ok</button>
            </dialog>
            
            <style>
                input {
                    display: none;
                }
                
                dialog {
                    border: none;
                    padding: calc(var(--padding) / 2) var(--padding);
                    border-radius: var(--padding);
                    
                    gap: var(--padding);
                    
                    width: 80%;
                    max-width: 50ch;
                    
                    align-items: center;
                }
                
                dialog[open] {
                    display: flex;
                }
                
                ::backdrop {
                    backdrop-filter: blur(5px);
                }
                
                button {
                    border: 1px solid black;
                    outline: none;
                }
                
                button:hover, button:focus {
                    color: var(--highlight-color);
                    border-color: var(--highlight-color);
                }
                
                error-message {
                    flex: 1;
                    height: fit-content;
                }
            </style>
        `

        const controlElement = shadow.querySelector('control-element')
        const input = shadow.querySelector('input')
        const dialog = shadow.querySelector('dialog')
        const errorMessage = shadow.querySelector('error-message')
        const dialogButton = shadow.querySelector('button')

        input.addEventListener('change', async () => {
            const file = input.files[0]
            if (!file) return

            controlElement.setAttribute('working', 'working')
            input.setAttribute('disabled', 'disabled')

            try {
                await this.uploadFile(file)
            } catch (e) {
                errorMessage.setAttribute('message', `Failed to upload ${file.name}.`)
                dialog.showModal()
            }

            input.removeAttribute('disabled')
            controlElement.removeAttribute('working')
        })

        dialogButton.addEventListener('click', () => {
            dialog.close()
        })
    }

    async uploadFile(file) {
        const path = location.pathname.slice(1).split(/\/+/).slice(1).join('/');
        const form = new FormData()

        form.append('newFile', file)

        await fetch(`http://localhost:8080/${path}/${file.name}`, {
            method: 'POST',
            body: form,
            ...authorizationHeader()
        })

        this.dispatchEvent(new CustomEvent('uploaded'))
    }
}

customElements.define('upload-button', UploadButton)
