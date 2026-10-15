class Day extends HTMLElement{
  constructor(){
    super()
		this._internals = this.attachInternals()
    this._radius = null
  }

  get hidden() {
		return this._internals.states.has("hidden")
  }

  set hidden(flag) {
		flag ? this._internals.states.add("hidden") : this._internals.states.delete("hidden")
  }

  _updateTheme(){
    const meta = document.querySelector('meta[name=color-scheme]');
    const newScheme = this.hidden ? "dark" : "light";
    const root = document.querySelector(":root")
    root.style.colorScheme = newScheme
  }

  _updateAnimation(){
    const container = this.querySelector(".day-container")
    container.querySelectorAll(".day-ray")
      .forEach(ray => {
        const theta = parseFloat(ray.style.transform.split(" ").pop(-1).match(/\d*\.?\d+/)[0])
        const ux = Math.cos(theta)
        const uy = Math.sin(theta)
        if (this.hidden){
          ray.setAttribute("visible", "false")
          ray.style.transform = "rotate("+ theta +"rad)"
        }
        else{
          ray.setAttribute("visible", "")
          ray.style.transform = "translate("+ ux * this._radius + "px, " + uy * this._radius +"px)" + "rotate("+ theta +"rad)"
        }
      })

    container.querySelectorAll(".day-circle")
      .forEach(circle => {
        if (this.hidden){
          circle.style.width = circle.getAttribute("size") + "%"
          circle.style.height = circle.getAttribute("size") + "%"
        }
        else{
          circle.style.width = "0"
          circle.style.height = "0"
        }
      })
  }

  connectedCallback(){
    this.hidden = window.matchMedia('(prefers-color-scheme: dark)').matches

    this.innerHTML = `
    <div class="day-container">
      <input type = "checkbox" class = "day-button" ${this.hidden ? "" : "checked"}>
    </div>
    `

    // Initialization
    const btn = this.querySelector(".day-button")
    const container = this.querySelector(".day-container")
    const nrays = 10
    this._radius = 50 / 1.2

    let circles = [
      [35, -1, -1.2],
      [15, 0.7, 2],
      [20, -1, 0.7]
    ]

    for (let i = 0; i < nrays; i++) {
      const ray = document.createElement("div")
      ray.classList.add("day-ray")
      
      const theta = 2 *  Math.PI / nrays * i
      const ux = Math.cos(theta)
      const uy = Math.sin(theta)
      ray.style.transform = "translate("+ ux * this._radius + "px, " + uy * this._radius +"px)" + "rotate("+ theta +"rad)"
      container.appendChild(ray)
    }


    circles.forEach(circle => {
      const scale = this._radius / 5
      const elmnt = document.createElement("div")
      elmnt.classList.add("day-circle")
      elmnt.style.transform = "translate(" + scale / circle[1] +"px, " + scale / circle[2] + "px)"
      elmnt.style.width = 0
      elmnt.style.height = 0
      elmnt.setAttribute("size", circle[0])
      container.appendChild(elmnt)
    })

    this._updateTheme()
    this._updateAnimation()

    btn.addEventListener("change", (event) =>{
      this.hidden = !event.target.checked
      this._updateTheme()
      this._updateAnimation()
    })
  }
}

customElements.define("day-mode", Day)