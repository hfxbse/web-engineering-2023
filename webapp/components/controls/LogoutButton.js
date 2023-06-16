import {invalidateSession} from "/Session.js";
import '/components/controls/ControlElement.js'

export default class LogoutButton extends HTMLElement {
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
                    <span class="material-symbols-outlined icon">logout</span>
                </control-element>
            </button>
            
            <style>
                button {
                    padding: 0;
                }
            </style>
        `

        const controlElement = shadow.querySelector('button')

        controlElement.addEventListener('click', async () => {
            controlElement.setAttribute('working', 'working')

            await invalidateSession()
        }, {once: true})
    }
}

customElements.define('logout-button', LogoutButton)
