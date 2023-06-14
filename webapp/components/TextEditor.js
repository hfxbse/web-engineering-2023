export default class TextEditor extends HTMLElement {
    static get observedAttributes() {
        return ['src']
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
        fetch(this.src)
            .then(async (response) => {
                if (!response.ok) {
                    this.displayError('Unexpected error occurred while loading file.')
                    return
                }

                const input = document.createElement('textarea')
                input.value = await response.text()

                this.updateContent(input)
            })
            .catch(() => this.displayError('Could not load file.'))
    }

    displayError(message) {
        const errorMessage = document.createElement('error-message')
        errorMessage.setAttribute('message', message)
        errorMessage.setAttribute('class', 'content')

        this.updateContent(errorMessage)
    }

    updateContent(element) {
        const parent = this.content.parentNode
        parent.removeChild(this.content)

        parent.appendChild(element)
        this.content = element
    }
}

customElements.define('text-editor', TextEditor)
