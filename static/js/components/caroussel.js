Array.from(document.getElementsByClassName("caroussel-container"))
    .forEach(caroussel => {
        caroussel.addEventListener("dragstart", (event) => {
			event.preventDefault();
        })

        const nshow = parseInt(caroussel.getAttribute("caroussel-show-items"))
        const itemContainer = caroussel.getElementsByClassName("caroussel-items")[0]
        const sliderContainer = caroussel.getElementsByClassName("caroussel-slider")[0]
        const selectsContainer = caroussel.getElementsByClassName("caroussel-selects")[0]
        const btnLeft = caroussel.getElementsByClassName("caroussel-left")[0]
        const btnRight = caroussel.getElementsByClassName("caroussel-right")[0]
        
        itemContainer.setAttribute("draggable", "false")
        sliderContainer.setAttribute("draggable", "false")
        caroussel.setAttribute("draggable", "false")
        
        const items = Array.from(caroussel.getElementsByClassName("caroussel-item"))
        const nitems = items.length

        itemContainer.style.width = "calc(" + (2 * nitems / nshow ) + " * 100% + 20px)"

        let off = 1 / (2 * nitems) * 100

        let selects = []
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.setAttribute("caroussel-item-idx", i)
            itemContainer.appendChild(item.cloneNode(true))

            let select = document.createElement("div")
            select.classList.add("caroussel-select")
            if (i == 0){
                select.classList.add("caroussel-selected")
            }
            select.addEventListener("click", () => selectCallback(i))
            selectsContainer.appendChild(select)
            selects.push(select)
        }

        const time = 200
        const options = {
            duration: time,
            iterations: 1,
            fill: "forwards"
        };
        let currentIdx = 0
        let currentOffset = 0
        let targetOffset = 0
        let animation

        function move(amount, direction){
            if (animation){
                currentOffset = animation.overallProgress * (targetOffset - currentOffset) + currentOffset
                animation.cancel()
            }

            if ((direction > 0) && (currentIdx >= nitems)){
                currentOffset += nitems * off
                currentIdx -= nitems
            }
            else if ((direction < 0) && (currentIdx <= 0)){
                currentOffset -= nitems * off
                currentIdx += nitems
            }
            currentIdx += direction * amount
            targetOffset = -currentIdx * off
            
            const translate = [
                { transform: "translateX(" + currentOffset + "%)" }, 
                { transform: "translateX(" + targetOffset + "%)" },
            ];
            animation = itemContainer.animate(translate, options)

        }

        function updateSelect(idx){
            selects.forEach(select => {
                select.classList.remove("caroussel-selected")
            })
            selects[(idx + nitems) % nitems].classList.add("caroussel-selected")
        }
        
        function selectCallback(idx){
            if (idx > currentIdx){
                move(idx - currentIdx, 1)
            }
            else{
                move(currentIdx - idx, -1)
            }
            updateSelect(currentIdx)

        }

        btnLeft.addEventListener("click", () =>{
            selectCallback(currentIdx - 1)
        })

        btnRight.addEventListener("click", () =>{
            selectCallback(currentIdx + 1)
        })

        function clipOffset(offset){
            if (offset > 0){
                offset -= nitems * off
            }
            else if (offset < -nitems * off){
                offset += nitems * off
            }
            return offset
        }

        function enterScroll(touchX){
            mousedown = true
            touchStartX = touchX
            touchPreviousX = touchX
            itemContainer.setAttribute("caroussel-scrolling", "true")
        }

        function scroll(touchMoveX){
            if (touchPreviousX && Math.abs(touchMoveX - touchPreviousX) > 200){
                touchPreviousX = touchMoveX
                return
            }

            if (animation){
                currentOffset = animation.overallProgress * (targetOffset - currentOffset) + currentOffset
                animation.cancel()
                animation = null
            }

            offset = (touchMoveX - touchStartX) / itemContainer.offsetWidth * 100 + currentOffset
            offset = clipOffset(offset)

            let idx = -Math.round(offset / off)
            updateSelect(idx)
            
            itemContainer.style.transform = "translateX(" + offset + "%)" 
        }

        function exitScroll(touchMoveX){
            mousedown = false
            offset = (touchMoveX - touchStartX) / itemContainer.offsetWidth * 100 + currentOffset
            offset = clipOffset(offset)

            let idx = -Math.round(offset / off)
            currentOffset = offset
            // currentIdx = idx
            itemContainer.setAttribute("caroussel-scrolling", "false")
            selectCallback(idx)
        }
        
        let touchStartX, touchPreviousX
        itemContainer.addEventListener("touchstart", (event) => {
            enterScroll(event.changedTouches[0].clientX)
        })
    
        itemContainer.addEventListener("touchmove", (event) => {
            scroll(event.changedTouches[0].clientX)
        })

        itemContainer.addEventListener("touchend", (event) => {
            if (event.changedTouches.length > 1){
                return;
            }
            console.log("touchend")
            exitScroll(event.changedTouches[0].clientX)
        })

        let mousedown
        itemContainer.addEventListener("mousedown", (event) => {
            if (mousedown){
                return
            }
            enterScroll(event.clientX)
        })

        itemContainer.addEventListener("mousemove", (event) => {
            if (!mousedown){
                return
            }
            scroll(event.clientX)
        })

        itemContainer.addEventListener("mouseup", (event) => {
            if (!mousedown){
                return
            }
            exitScroll(event.clientX)
        })

        itemContainer.addEventListener("mouseleave", (event) => {
            if (!mousedown){
                return
            }
            exitScroll(event.clientX)
        })

    })