import {authorizationHeader} from "/Session.js";
import '/components/controls/ControlElement.js'
import '/components/error/ErrorDialog.js'

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
            <error-dialog></error-dialog>
            
            <style>
                input {
                    display: none;
                }
            </style>
        `

        const controlElement = shadow.querySelector('control-element')
        const input = shadow.querySelector('input')
        const errorDialog = shadow.querySelector('error-dialog')

        input.addEventListener('change', async () => {
            const file = input.files[0]
            if (!file) return

            controlElement.setAttribute('working', 'working')
            input.setAttribute('disabled', 'disabled')

            try {
                await this.uploadFile(file)
            } catch (e) {
                errorDialog.innerText = `Failed to upload ${file.name}.`
                errorDialog.showModal()
            }

            input.removeAttribute('disabled')
            controlElement.removeAttribute('working')
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
