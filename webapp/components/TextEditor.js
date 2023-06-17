export default class TextEditor extends HTMLElement {
    constructor() {
        super();
        this.value = ''
    }

    static get observedAttributes() {
        return ['value']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;

        if (this.content) this.displayText()
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

        this.content = shadow.querySelector('textarea')
        this.displayText()
    }

    displayText() {
        const input = document.createElement('textarea')
        input.value = this.value
        input.addEventListener('change', () => {
            this.value = input.value
            this.dispatchEvent(new CustomEvent('change'));
        })

        this.updateContent(input)
    }

    updateContent(element) {
        const parent = this.content.parentNode
        parent.removeChild(this.content)

        parent.appendChild(element)
        this.content = element
    }
}

customElements.define('text-editor', TextEditor)
