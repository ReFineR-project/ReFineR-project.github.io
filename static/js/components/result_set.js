class ResultSet extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const set = this.getAttribute("set")
    const results = RESULT_LINKS[set]
    const rootDir = this.getAttribute("root-dir")



    let radioName = this.getAttribute("name")
    radioName = radioName ? radioName : set

    const labels = []
    const content = []
    const pages = []
    results.forEach((res, idx) => {
      const resultDir = rootDir + "results/intensity/" + set + "/" + res["scene"] + "/" + res["item"] + "/"
      const channelDir = resultDir + "imgs/" + res["compare"] + "/"
      const rgbFile =  channelDir + "target.png"

      const name = radioName + "img" + idx.toString()
      const checked = idx == 0 ? "checked" : ""
      pages.push(`
        <div>
          <label for="${name}">
            <img src="${rgbFile}">
          </label>
          <div>
            <result-page set = "${set}" root-dir = "${rootDir}" img-idx="${idx}"></result-page>  
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
