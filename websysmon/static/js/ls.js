const byId = function(id) { return document.getElementById(id); };

function ls(items)
{
    const filebrowser = byId("file-browser");
    filebrowser.innerHTML = "";

    const path = items["path"];
    byId("path").innerHTML = path;

    /* on click for back button */
    const onclickBackButton = `getJSONAndCall(ls, '/browseparent/${path}')`
    byId("back-button").setAttribute("onclick", onclickBackButton)

    /* on click for toggle hidden button */
    const toggleHiddenButton = byId("toggle-hidden-button")
    const onclickToggleHiddenButton = `getJSONAndCall(ls, '/togglehidden/${path}')`
    toggleHiddenButton.setAttribute("onclick", onclickToggleHiddenButton)

    /* Set icon for toggle hidden button */
    const toggleHiddenButtonIcon = byId("toggle-hidden-button-icon")
    if(items['hidden']) 
        toggleHiddenButtonIcon.setAttribute("src", "/static/symbols/eye-off.svg")
    else
        toggleHiddenButtonIcon.setAttribute("src", "/static/symbols/eye.svg")

    /* Fill file browser with items using the item template */
    const file_item_template = document.querySelector("#file-browser-item");

    for(let i = 0; i < items["items"].length; i++)
    {
        item = items["items"][i];

        let onclick = "";
        let icon = "/static/symbols/file.svg"
        
        if(item.isdir) 
        {
            onclick = `getJSONAndCall(ls, '/browse/${item.path}')`
            icon = "/static/symbols/folder.svg"
        }

        /* Clone the file browser item template */
        const templateClone = file_item_template.content.cloneNode(true);

        /* Set icon */
        const img = templateClone.querySelector("img");
        img.src = icon;

        /* On double click action */
        const maindiv = templateClone.querySelector("div");

        const isMobile = navigator.maxTouchPoints != 0;
        clickAttribute = isMobile ? "onclick" : "ondblclick";

        maindiv.setAttribute(clickAttribute, onclick);
        maindiv.setAttribute("tabindex", i);

        /* Item name */
        const itemDetails = templateClone.querySelectorAll("span");
        itemDetails[0].textContent = item.name;

        /* Item date and size */
        itemDetails[1].textContent = item.size;
        itemDetails[2].textContent = item.date;


        filebrowser.appendChild(templateClone);
    }
}

getJSONAndCall(ls, '/browse')