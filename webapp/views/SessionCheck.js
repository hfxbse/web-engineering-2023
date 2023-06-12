import {sessionActive} from "../Session.js";

export default class SessionCheck extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
                <div>
                    <p>Trying to log you in…</p>
                    <div class="spinner"></div>
                </div>
            
            <style>
                :host {
                    display: grid;
                    align-items: center;
                    justify-content: center;
                    
                    height: 100vh;
                    width: 100vw;
                }
            
                div:not(.spinner) {
                    display: flex;
                    align-items: center;
                }
            
                p {
                    font-size: 1.25rem;
                }
            
                .spinner {
                    width: 1rem;
                    height: 1rem;
                    
                    margin-left: var(--padding);
                    
                    border-radius: 50%;
                    border: calc(var(--padding) / 6) solid var(--highlight-color);
                    border-right-color: transparent;
                    animation: spin 600ms infinite linear;
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0);
                    }                
                    
                    100% {
                        transform: rotate(360deg);
                    }
                }
            </style>
        `

        sessionActive().then(active => console.dir({active}))
    }
}

customElements.define('session-check', SessionCheck)
