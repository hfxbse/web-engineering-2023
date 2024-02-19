import '/components/error/ErrorMessage.js'
import '/components/BaseDialog.js'

export default class ErrorDialog extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <base-dialog>
                <link rel="stylesheet" href="/base.css">
                <div>
                    <error-message>
                        <slot></slot>
                    </error-message>
                    <button>Ok</button>
                </div>
            </base-dialog>
            
            <style>
               div {
                    display: flex;
                    align-items: center;
                    gap: var(--padding);
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

        this.dialog = shadow.querySelector('base-dialog')
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
