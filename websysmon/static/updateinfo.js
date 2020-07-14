var byId = function(id) { return document.getElementById(id); };

function updateInfo(info)
{
    byId("processor").innerHTML = info["processor"];
    byId("core_count").innerHTML = info["core_count"];
    byId("architecture").innerHTML = info["architecture"];
    byId("operating_sys").innerHTML = info["operating_sys"];
    byId("memory").innerHTML = info["memory"];
    byId("uptime").innerHTML = info["uptime"];
}

function updateDiskInfo(info)
{
    /* Table header */
    byId("disktable").innerHTML = `
        <tr>
            <th>Device</th>
            <th>File System</th>
            <th>Mountpoint</th>
            <th>Free Space</th>
            <th>Size</th>
        </tr>
    `

    /* Loop through each disk and add table row */
    for(var i = 0; i < info["disk_info"].length; i++)
    {
        device_name = info["disk_info"][i]["device"];
        filesystem = info["disk_info"][i]["fstype"];
        mountpoint = info["disk_info"][i]["mountpoint"];
        size = info["disk_info"][i]["size"];
        free_space = info["disk_usage"][mountpoint]

        byId("disktable").innerHTML += `
        <tr>
            <td>${device_name}</td>
            <td>${filesystem}</td>
            <td>${mountpoint}</td>
            <td>${free_space}</td>
            <td>${size}</td>
        </tr>
    `
    }

}

getJSONAndCall(updateInfo, '/info');
getJSONAndCall(updateDiskInfo, '/disks')