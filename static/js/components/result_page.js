const RESULT_LINKS = {
  "intensity":{
    "TanksAndTemples": [
      {
        "scene": "Meetingroom",
        "item": "171",
        "compare": "g",
        "last": "0209.png",
        "renders": ["g"]
      },
      {
        "scene": "Meetingroom",
        "item": "281",
        "compare": "g",
        "last": "0141.png",
        "renders": ["g"]
      },
      {
        "scene": "Church",
        "item": "281",
        "compare": "g",
        "last": "0126.png",
        "renders": ["g"]
      }
    ],
      "ETH3D": [{
        "scene": "electro",
        "item": "DSC_9259",
        "compare": "g", 
        "last": "0210.png",
        "renders": ["g"]
      },
      {
        "scene": "facade",
        "item": "DSC_0324",
        "compare": "g",
        "last": "0237.png",
        "renders": ["g"]
      },
      {
        "scene": "playground",
        "item": "DSC_0568",
        "compare": "g",
        "last": "0212.png",
        "renders": ["g"]
      }],
      "nuScenes": [{
        "scene": "1",
        "item": "18",
        "compare": "r", 
        "last": "0143.png",
        "renders": ["r"]
      },
      {
        "scene": "1",
        "item": "23",
        "compare": "r",
        "last": "0140.png",
        "renders": ["r"]
      },
      {
        "scene": "3",
        "item": "32",
        "compare": "r",
        "last": "0144.png",
        "renders": ["r"]
      }],
      "Livox": [{
        "scene": "Yuan0",
        "item": "0",
        "compare": "r", 
        "last": "0170.png",
        "renders": ["r"]
      },
      {
        "scene": "Yuan2",
        "item": "2",
        "compare": "r",
        "last": "0160.png",
        "renders": ["r"]
      },
      {
        "scene": "Yuan3",
        "item": "3",
        "compare": "r",
        "last": "0237.png",
        "renders": ["r"]
      }],
      "RGBDScenes": [{
        "scene": "scene_01",
        "item": "500",
        "compare": "g", 
        "last": "0169.png",
        "renders": ["g"]
      },
      {
        "scene": "scene_07",
        "item": "10",
        "compare": "g",
        "last": "0265.png",
        "renders": ["g"]
      },
      {
        "scene": "scene_13",
        "item": "10",
        "compare": "g",
        "last": "0198.png",
        "renders": ["g"]
      }
    ]
  },
  "normals": {
    "TanksAndTemples": [
      {
        "scene": "Church",
        "item": "332",
        "compare": "nx",
        "last": "0116.png",
        "renders": ["nx", "ny", "nz"]
      }
    ],
    "Carla": [
      {
        "scene": "seq1",
        "item": "1704",
        "compare": "nx",
        "last": "0144.png",
        "renders": ["nx", "ny", "nz"]

      }
    ],
    "ETH3D": [
      {
        "scene": "kicker",
        "item": "DSC_6504",
        "compare": "nx",
        "last": "0167.png",
        "renders": ["nx", "ny", "nz"]
      }
    ],
    
    "nuScenes": [
      {
        "scene": "12",
        "item": "26",
        "compare": "nx",
        "last": "0252.png",
        "renders": ["nx", "ny", "nz"]
      }
    ],

    "Livox": [
      {
        "scene": "Yuan3",
        "item": "3",
        "compare": "nx",
        "last": "0154.png",
        "renders": ["nx", "ny", "nz"]
      }
    ],
    
    "RGBDScenes": [
      {
        "scene": "scene_07",
        "item": "100",
        "compare": "nx",
        "last": "0189.png",
        "renders": ["nx", "ny", "nz"]
      }
    ]
  }
}
  

class ResultPage extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const imgIdx = parseInt(this.getAttribute("img-idx"))
    let modality = this.getAttribute("modality")
    modality ??= "intensity"

    const set = this.getAttribute("set")
    const results = RESULT_LINKS[modality][set][imgIdx]
    const scene = results["scene"]
    const rootDir = this.getAttribute("root-dir")
    const resultDir = rootDir + "results/" + modality + "/" + set + "/" + scene + "/" + results["item"] + "/"
    const channel = results["compare"]
    const channelDir = resultDir + "imgs/" + channel + "/"

    const rgbFile =  channelDir + "target.png"
    const beforeFile = channelDir + "0000.png"
    const afterFile = channelDir + results["last"]

    let renderLeft, renderRight
    if (results["renders"].length == 1){
      const renderVideo = resultDir + "imgs/" + results["renders"][0] + "/output.mp4"
      const renderThumb = resultDir + "imgs/" + results["renders"][0] + "/0000.png"
      renderRight = `<video-lazy data-src-thumb = "${renderThumb}" data-src-video = "${renderVideo}" video-zoom></video-lazy>`
      renderLeft = ""
    }
    else{
      const renders = []
      const n = results["renders"].length
      for (let i = 0; i < n; i++) {
        const renderVideo = resultDir + "imgs/" + results["renders"][i] + "/output.mp4"
        const renderThumb = resultDir + "imgs/" + results["renders"][i] + "/0000.png"
        renders.push(`<video-lazy data-src-thumb = "${renderThumb}" data-src-video = "${renderVideo}" video-zoom></video-lazy>`)
      }
      renderLeft = `
        ${renders.slice(0, n / 2).join("\n")}
      `
      renderRight = `
        ${renders.slice(n/2).join("\n")}
      `
    }


    const fusedVideo = resultDir + "imgs/fused/output.mp4"
    const fusedThumb = resultDir + "init.png"
    this.innerHTML = `
    <div class="columns">
      <div class="column">
        <image-compare
          data-src-before = "${beforeFile}"
          data-src-after = "${rgbFile}"
          data-label-before = "10px error"
          data-label-after = "RGB Image">
        </image-compare>
	      <video-lazy data-src-thumb = "${fusedThumb}" data-src-video = "${fusedVideo}" video-zoom></video-lazy>
        ${renderLeft}
      </div>
      <div class="column">
        <image-compare 
          data-src-before = "${afterFile}"
          data-src-after = "${rgbFile}"
          data-label-before = "ReFineR"
          data-label-after = "RGB Image">
        </image-compare>
	      ${renderRight}
      </div>
    </div>
    `
  }
}

customElements.define("result-page", ResultPage)
