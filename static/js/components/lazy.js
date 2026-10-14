class VideoLazy extends HTMLElement{
	constructor(){
			super()
	}

	connectedCallback(){
		const thumbSrc = this.dataset.srcThumb
		const videoSrc = this.dataset.srcVideo
		this.innerHTML = `
			<div class = "lazy-container">
				<img src = ${thumbSrc} class = "lazy-content">
				<div class="lazy-button">
					<i class="fa fa-caret-right fa-lg lazy-arrow"></i>
				</div>
				<div class="loader" style = "display: none"></div>
			</div>
		`

		const container = this.querySelector(".lazy-container")
		const thumb = this.querySelector(".lazy-content")
		const button = this.querySelector(".lazy-button")
		const loader = this.querySelector(".loader")
		const zoomVideo = this.hasAttribute("video-zoom")

		button.addEventListener("click", () => {
			let video
			if (!zoomVideo){
				video = document.createElement("video")
				const src = document.createElement("source")

				video.setAttribute("controls", "")
				video.setAttribute("muted", "")
				video.setAttribute("playsinline", "")
				video.setAttribute("autoplay", "")

				src.setAttribute("type", "video/mp4")
				src.setAttribute("src", videoSrc)

				video.appendChild(src)
			}
			else{
				video = document.createElement("video-zoom")
				video.setAttribute("data-src-video", videoSrc)
			}

			loader.style.display = "block"
			video.style.opacity = 0
			video.classList.add("lazy-content")
			video.addEventListener("loadeddata", () => {
				video.style.opacity = 1
				thumb.style.opacity = 0
				loader.style.display = "none"
			})
			container.appendChild(video)

			button.style.display = "none"
		})
	}
}

customElements.define("video-lazy", VideoLazy)