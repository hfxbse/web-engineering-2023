export default class TextEditor extends HTMLElement {
    constructor() {
        super();
        this.value = ''
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css"/>
            <textarea></textarea>
            <style>
                error-message {
                    height: 100%;
                    width: 100%;
                }
                
                textarea {
                    outline: none;
                
                    border: none;
                    resize: none;
                    display: block;
                    
                    padding: var(--padding);
                    height: calc(100% - var(--padding) * 2);
                    width: calc(100% - var(--padding) * 2);
                    
                }
                
                error-message {
                    display: grid;
                    place-items: center;
                }
            </style>
        `

        this.input = shadow.querySelector('textarea')
        this.input.addEventListener('change', () => this.dispatchEvent(new CustomEvent('change')))
        this.input.addEventListener('input', () => {
            this.value = this.input.value
            this.dispatchEvent(new CustomEvent('input'));
        })

        this.displayText(this.value)
    }

    displayText(text) {
        this.input.value = text
        this.value = text
    }
}

customElements.define('text-editor', TextEditor)
