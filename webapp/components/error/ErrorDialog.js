import '/components/error/ErrorMessage.js'

export default class ErrorDialog extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <dialog>
                <error-message>
                    <slot></slot>
                </error-message>
                <button>Ok</button>
            </dialog>
            
            <style>
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

        this.dialog = shadow.querySelector('dialog')
        const dialogButton = shadow.querySelector('button')

        dialogButton.addEventListener('click', () => {
            this.dialog.close()
        })
    }

    showModal() {
        this.dialog.showModal()
    }
}

customElements.define('error-dialog', ErrorDialog)
