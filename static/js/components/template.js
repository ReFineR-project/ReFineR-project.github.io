class ComponentTemplate extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const shadow = this.attachShadow({mode: "open"})
    shadow.innerHTML = `
    <slot name=slot></slot>
    `

    const link = document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    const sheet = this.getAttribute("csssheet") ? this.getAttribute("csssheet") : "static/css/components/template.css"
    link.setAttribute("href", sheet)
    shadow.appendChild(link)
  }
}

customElements.define("template-component", ComponentTemplate)
