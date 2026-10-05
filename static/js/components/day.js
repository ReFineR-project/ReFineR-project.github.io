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
    const root = document.querySelector(":root")
    const newScheme = this.hidden ? "dark" : "light";
    root.setAttribute("data-scheme", newScheme)
    root.style.colorScheme = newScheme
    meta.content = newScheme
  }

  _updateAnimation(){
    const btn = this.querySelector(".day-button")
    btn.querySelectorAll(".day-ray")
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

    btn.querySelectorAll(".day-circle")
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
    this.innerHTML = `
    <div class="day-container">
      <div class="day-button">
      </div>
    </div>
    `

    // Initialization
    const btn = this.querySelector(".day-button")
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
      btn.appendChild(ray)
    }


    circles.forEach(circle => {
      const scale = this._radius / 5
      const elmnt = document.createElement("div")
      elmnt.classList.add("day-circle")
      elmnt.style.transform = "translate(" + scale / circle[1] +"px, " + scale / circle[2] + "px)"
      elmnt.style.width = 0
      elmnt.style.height = 0
      elmnt.setAttribute("size", circle[0])
      btn.appendChild(elmnt)
    })

    this.hidden = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    this._updateAnimation()

    const meta = document.querySelector('meta[name=color-scheme]')
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList){
        if (mutation.type === "attributes" && mutation.attributeName == "content"){
          const value = mutation.target.getAttribute(mutation.attributeName) == "dark"
          if (value != this.hidden){
            this.hidden = !this.hidden
            this._updateAnimation()
          }
        }
      }
    });
    const options = {attributes: true, childList: false, subtree: false}
    observer.observe(meta, options);
    
    btn.addEventListener("click", () =>{
      this.hidden = !this.hidden
      this._updateTheme()
      this._updateAnimation()
    })
  }
}

customElements.define("day-mode", Day)