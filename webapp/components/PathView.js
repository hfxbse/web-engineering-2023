import {invalidateSession} from "/Session.js";
import '/components/RouterLink.js'
import '/components/SpinnerIndicator.js'

export default class PathView extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <div>
                <router-link>
                    <div class="material-symbols-outlined icon">arrow_upward</div>
                </router-link>
                <p></p>
            </div>
            <slot></slot>
            <button class="material-symbols-outlined icon">logout</button>
            <style>
                :host {
                    display: flex;
                    gap: var(--padding);
                }
                
                div:not(.icon) {
                    display: flex;
                    flex: 1;
                    
                    align-items: center;
                    
                    gap: calc(var(--padding) / 2);
                }
                
                .icon {
                    display: grid;
                    place-items: center;
                    
                    color: black;
                    font-weight: bold;
                    
                    border: 1px solid black;
                    border-radius: 50%;
                    padding: calc(var(--padding) / 2);
                }
                
                .icon:hover, .icon:focus, .icon:disabled {
                    color: var(--highlight-color);
                    border-color: var(--highlight-color)
                }
            </style>
        `

        const path = shadow.querySelector('p')
        const parent = shadow.querySelector('router-link')
        const icon = shadow.querySelector('.icon')
        const logout = shadow.querySelector('button')

        path.innerText = location.pathname.slice(1)
        parent.setAttribute('href', this.parentDirectory() ?? '')

        if (!/\//.test(this.parentDirectory())) {
            icon.innerText = "home"
            parent.setAttribute('disabled', 'disabled')
        }

        logout.addEventListener('click', async () => {
            logout.innerText = ''
            logout.setAttribute('disabled', 'disabled')
            logout.appendChild(document.createElement('spinning-indicator'))

            await invalidateSession()
        });
    }

    parentDirectory() {
        if (/\/.+/.test(location.pathname.slice(1))) {
            let parent = location.pathname.replace(/\/+/g, '/')
            if (parent.endsWith("/")) parent = parent.slice(0, parent.length - 1)

            return parent.slice(0, parent.lastIndexOf("/"))
        }
    }
}

customElements.define('path-view', PathView)
