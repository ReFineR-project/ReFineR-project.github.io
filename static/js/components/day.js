Array.from(document.getElementsByClassName("day-button"))
    .forEach(btn => {
        // Initilize theme
        theme_elements = document.querySelectorAll("[data-theme]")
        Array.from(theme_elements).forEach(elemnt => elemnt.setAttribute("data-theme", "light"))

        // Initialization
        let nrays = 10
        let radius = btn.offsetWidth / 1.2

        circles = [
            [35, -1, -1.2],
            [15, 0.7, 2],
            [20, -1, 0.7]
        ]

        for (let i = 0; i < nrays; i++) {
            ray = document.createElement("div")
            ray.classList.add("day-ray")
            
            let theta = 2 *  Math.PI / nrays * i
            let ux = Math.cos(theta)
            let uy = Math.sin(theta)
            ray.style.transform = "translate("+ ux * radius + "px, " + uy * radius +"px)" + "rotate("+ theta +"rad)"
            btn.appendChild(ray)
        }


        circles.forEach(circle => {
            let scale = radius / 5
            let elmnt = document.createElement("div")
            elmnt.classList.add("day-circle")
            elmnt.style.transform = "translate(" + scale / circle[1] +"px, " + scale / circle[2] + "px)"
            elmnt.style.width = 0
            elmnt.style.height = 0
            elmnt.setAttribute("size", circle[0])
            btn.appendChild(elmnt)

        })

        // Toogle
        let hide = false
        btn.addEventListener("click", () =>{
            hide = !hide

            // Change theme
            theme_elements = document.querySelectorAll("[data-theme]")
            new_theme = theme_elements[0].getAttribute("data-theme") == "light" ? "dark" : "light"
            Array.from(theme_elements).forEach(elemnt => elemnt.setAttribute("data-theme", new_theme))

            // Update animation
            Array.from(btn.getElementsByClassName("day-ray"))
                .forEach(ray => {
                    let theta = parseFloat(ray.style.transform.split(" ").pop(-1).match(/\d*\.?\d+/)[0])
                    let ux = Math.cos(theta)
                    let uy = Math.sin(theta)
                    if (hide){
                        ray.setAttribute("visible", "false")
                        ray.style.transform = "rotate("+ theta +"rad)"
                    }
                    else{
                        ray.setAttribute("visible", "")
                        ray.style.transform = "translate("+ ux * radius + "px, " + uy * radius +"px)" + "rotate("+ theta +"rad)"
                    }
                })

            Array.from(btn.getElementsByClassName("day-circle"))
                .forEach(circle => {
                    if (hide){
                        circle.style.width = circle.getAttribute("size") + "%"
                        circle.style.height = circle.getAttribute("size") + "%"
                    }
                    else{
                        circle.style.width = "0"
                        circle.style.height = "0"
                    }
                })
        })
    })