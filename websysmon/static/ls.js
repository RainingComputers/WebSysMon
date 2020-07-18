const byId = function(id) { return document.getElementById(id); };

function ls(items)
{
    const filebrowser = byId("file-browser");
    filebrowser.innerHTML = "";

    const path = items["path"];
    byId("path").innerHTML = path;

    /* on click for back button */
    const onclick_back_button = `getJSONAndCall(ls, '/browseparent/${path}')`
    byId("back-button").setAttribute("onclick", onclick_back_button)

    /* on click for toggle hidden button */
    const toggle_hidden_button = byId("toggle-hidden-button")
    const onclick_toggle_hidden_button = `getJSONAndCall(ls, '/togglehidden/${path}')`
    toggle_hidden_button.setAttribute("onclick", onclick_toggle_hidden_button)

    /* Set icon for toggle hidden button */
    const toggle_hidden_button_icon = byId("toggle-hidden-button-icon")
    if(items['hidden']) 
        toggle_hidden_button_icon.setAttribute("src", "/static/symbols/eye-off.svg")
    else
        toggle_hidden_button_icon.setAttribute("src", "/static/symbols/eye.svg")

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
        const template_clone = file_item_template.content.cloneNode(true);

        /* Set icon */
        const img = template_clone.querySelector("img");
        img.src = icon;

        /* On double click action */
        const maindiv = template_clone.querySelector("div");

        const is_mobile = navigator.maxTouchPoints != 0;
        click_attribute = is_mobile ? "onclick" : "ondblclick";

        maindiv.setAttribute(click_attribute, onclick);
        maindiv.setAttribute("tabindex", i);

        /* Item name */
        const item_details = template_clone.querySelectorAll("span");
        item_details[0].textContent = item.name;

        /* Item date and size */
        item_details[1].textContent = item.size;
        item_details[2].textContent = item.date;


        filebrowser.appendChild(template_clone);
    }
}

getJSONAndCall(ls, '/browse')