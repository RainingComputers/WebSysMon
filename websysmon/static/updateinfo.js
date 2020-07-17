const byId = function(id) { return document.getElementById(id); };

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
    const disktable = byId("disk-table");
    const disk_item_template = document.querySelector("#disk-item");

    /* Loop through each disk and add table row */
    for(let disk of info["disk_info"])
    {
        /* Extract info from jason */
        const device_name = disk["device"];
        const filesystem = disk["fstype"];
        const mountpoint = disk["mountpoint"];
        const size = disk["size"];
        const free_space = info["disk_usage"][mountpoint]

        /* Clone template */
        const template_clone = disk_item_template.content.cloneNode(true);
        const td = template_clone.querySelectorAll("td");

        /* Fill template */
        td[0].textContent = device_name;
        td[1].textContent = filesystem;
        td[2].textContent = mountpoint;
        td[3].textContent = free_space;
        td[4].textContent = size;

        /* Add template */
        disktable.appendChild(template_clone)
    }

}

getJSONAndCall(updateInfo, '/info');
getJSONAndCall(updateDiskInfo, '/disks')