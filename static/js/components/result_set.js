class ResultSet extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const set = this.getAttribute("set")
    let modality = this.getAttribute("modality")
    modality ??= "intensity"
    const results = RESULT_LINKS[modality][set]
    const rootDir = this.getAttribute("root-dir")

    const radioName = set + "-" + modality

    const labels = []
    const content = []
    const pages = []
    results.forEach((res, idx) => {
      const resultDir = rootDir + "results/"+ modality + "/" + set + "/" + res["scene"] + "/" + res["item"] + "/"
      const channelDir = resultDir + "imgs/" + res["compare"] + "/"
      const rgbFile =  channelDir + "target.png"

      const name = radioName + "-" + idx.toString()
      const checked = idx == 0 ? "checked" : ""
      pages.push(`
        <div>
          <label for="${name}">
            <img src="${rgbFile}">
          </label>
          <div>
            <result-page set = "${set}" root-dir = "${rootDir}" img-idx="${idx}" modality="${modality}"></result-page>  
          </div>
        </div>
      `)
    });

    this.innerHTML = `
      <pages-radio name = "${radioName}">
        ${pages.join(" ")}
      </pages-radio>
    `
  }
}

customElements.define("result-set", ResultSet)
