Array.from(document.getElementsByClassName("page-container")).forEach(pages => {
    content = pages.querySelectorAll(":scope > .page-content")[0]
    Array.from(pages.querySelectorAll(":scope > .page-labels > .page-radio")).forEach(input => {
        let contents = Array.from(pages.querySelectorAll(":scope > .page-content > .page"))
        if (input.checked){
            found = contents.filter(page => page.getAttribute("ref") == input.value)[0]
            found.setAttribute("selected", "true")
        }
        input.addEventListener("click", () => {
            found = contents.filter(page => page.getAttribute("ref") == input.value)[0]
            found.setAttribute("selected", "true")

            contents
                .filter(page => ((page.getAttribute("ref") != input.value)))
                .forEach(page =>  {
                    page.setAttribute("selected", "")
                })
            
        })
    });
})