import '/components/RouterLink.js'
import '/components/controls/ControlElement.js'
import {parentDirectoryURL} from "/Path.js";

export default class PathView extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link rel="stylesheet" href="/components/controls/controls.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <div>
                <router-link class="control">
                    <control-element>
                        <link rel="stylesheet" href="/components/controls/controls.css">
                        <div class="material-symbols-outlined icon">arrow_upward</div>
                    </control-element>
                </router-link>
                <p></p>
            </div>
            <slot></slot>
            
            <style>
                :host {
                    display: flex;
                    align-items: center;
                    gap: var(--padding);
                }
                
                div:not(.icon) {
                    display: flex;
                    flex: 1;
                    
                    align-items: center;
                    
                    gap: calc(var(--padding) / 2);
                }
                
                p {
                    word-wrap: anywhere;
                }
            </style>
        `

        const path = shadow.querySelector('p')
        const parent = shadow.querySelector('router-link')
        const icon = shadow.querySelector('.icon')

        path.innerText = location.pathname.slice(1).replace(/\/+/g, '/')
        parent.setAttribute('href', parentDirectoryURL() ?? '')

        if (!/\//.test(parentDirectoryURL())) {
            icon.innerText = "home"
            parent.setAttribute('disabled', 'disabled')
        }
    }
}

customElements.define('path-view', PathView)
