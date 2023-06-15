import {invalidateSession} from "/Session.js";
import '/components/ControlElement.js'

export default class LogoutButton extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <control-element>
                <button class="material-symbols-outlined icon">logout</button>
            </control-element>
            
            <style>
                .icon {
                    padding: 0;
                    color: black;
                    font-weight: bold;
                }
                
                control-element:hover .icon, control-element:focus .icon {
                    color: var(--highlight-color);
                }
            </style>
        `

        const controlElement = shadow.querySelector('control-element')

        controlElement.addEventListener('click', async () => {
            controlElement.setAttribute('working', 'working')

            await invalidateSession()
        }, {once: true})
    }
}

customElements.define('logout-button', LogoutButton)
