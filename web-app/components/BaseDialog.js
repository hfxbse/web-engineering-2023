export default class BaseDialog extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <dialog>
                <slot></slot>
            </dialog>
            <style>
                dialog {
                    border: none;
                    padding: calc(var(--padding) / 2) var(--padding);
                    border-radius: var(--padding);
                                        
                    width: 80%;
                    max-width: 50ch;
                }
                
                ::backdrop {
                    backdrop-filter: blur(5px);
                }
            </style>
        `

        this.dialog = shadow.querySelector('dialog')
    }

    showModal() {
        this.dialog?.showModal()
    }

    close() {
        this.dialog?.close()
    }
}

customElements.define('base-dialog', BaseDialog)
