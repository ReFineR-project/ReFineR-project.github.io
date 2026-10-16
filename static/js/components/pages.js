class Pages extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
		const children = this.children
		const pageName = this.getAttribute("name")
		const inputs = []
		const labels = []
		const pages = []

		Array.from(children).forEach((child, idx) => {
			const label = child.querySelector(":scope > label")
			const name = label.getAttribute("for")
			const input = document.createElement("input")
			input.classList.add("page-radio")
			input.setAttribute("type", "radio")
			input.setAttribute("id", name)
			input.setAttribute("name", pageName)
			input.setAttribute("value", name)
			if (idx == 0){
				input.setAttribute("checked", "")
			}
			labels.push(input)
			inputs.push(input)
			label.classList.add("page-label")
			labels.push(label)

			const page = child.querySelector(":scope > :not(label)")
			page.classList.add("page")
			page.setAttribute("ref", name)
			pages.push(page)
		})

		this.innerHTML = `
			<div class="page-container">
				<div class="page-labels">
				</div>
				<div class="page-content">
				</div>
			</div>
		`

		this.querySelector(":scope > .page-container > .page-labels").append(...labels)
		const pageContent = this.querySelector(":scope > .page-container > .page-content")
	
		Array.from(inputs).forEach(input => {
			if (input.checked){
				let found = pages.filter(page => page.getAttribute("ref") == input.value)[0]
				found.setAttribute("selected", "")
				pageContent.replaceChildren(found)
			}
			input.addEventListener("click", () => {
				let found = pages.filter(page => page.getAttribute("ref") == input.value)[0]
				found.setAttribute("selected", "")
				Array.from(pageContent.children).filter(
					page => page.getAttribute("ref") != input.value)
					.forEach(page => {
					page.removeAttribute("selected")
				})
				if(Array.from(pageContent.children)
					.filter(page => page.getAttribute("ref") == found.getAttribute("ref")).length == 0){
					pageContent.appendChild(found)
				}

			})
    })
  }
}

customElements.define("pages-radio", Pages)
