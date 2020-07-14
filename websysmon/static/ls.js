var byId = function(id) { return document.getElementById(id); };

function ls(items)
{
    filebrowser = byId("filebrowser");
    filebrowser.innerHTML = "";

    path = items["path"];
    byId("path").innerHTML = path;

    var onclick_back_button = `getJSONAndCall(ls, '/browseparent/${path}')`
    byId("backbutton").setAttribute("onclick", onclick_back_button)

    toggle_hidden_button = byId("togglehiddenbutton")
    var onclick_toggle_hidden_button = `getJSONAndCall(ls, '/togglehidden/${path}')`
    toggle_hidden_button.setAttribute("onclick", onclick_toggle_hidden_button)

    if(items['hidden']) 
        toggle_hidden_button.setAttribute("src", "/static/symbols/eye-off.svg")
    else
        toggle_hidden_button.setAttribute("src", "/static/symbols/eye.svg")

    for(var i=0; i<items["items"].length; i++)
    {
        var item = items["items"][i];

        var onclick = "";
        var icon = "/static/symbols/file.svg"

        if(item.isdir)
        {
            onclick = `getJSONAndCall(ls, '/browse/${item.path}')`
            icon = "/static/symbols/folder.svg"
        }

        filebrowser.innerHTML += `
            <div class="inline-center" style="column-gap: 50px;" onclick="${onclick}">
                <div class ="inline-center expand">
                    <div class="inline-center">
                        <img src="${icon}">
                        <span class="pad-sides" style="overflow-x: hidden;"> 
                            ${item["name"]} 
                        </span>
                    </div>
                </div>

                <p> ${item.size} </p>             
                <p> ${item.date} </p>                
            </div>
        `
    }
}

getJSONAndCall(ls, '/browse')