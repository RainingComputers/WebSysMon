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
    const diskItemTemplate = document.querySelector("#disk-item");

    /* Loop through each disk and add table row */
    for(let disk of info["disk_info"])
    {
        /* Extract info from jason */
        const deviceName = disk["device"];
        const filesystem = disk["fstype"];
        const mountpoint = disk["mountpoint"];
        const size = disk["size"];
        const freeSpace = info["disk_usage"][mountpoint]

        /* Clone template */
        const templateClone = diskItemTemplate.content.cloneNode(true);

        /* Fill template */
        templateClone.querySelector('#dsk').textContent = deviceName;
        templateClone.querySelector('#mtpt').textContent = mountpoint;
        templateClone.querySelector('#fs').textContent = filesystem;
        templateClone.querySelector('#size').textContent = size;
        templateClone.querySelector('#free').textContent = freeSpace;

        /* Add template */
        disktable.appendChild(templateClone)
    }

}

getJSONAndCall(updateInfo, '/info');
getJSONAndCall(updateDiskInfo, '/disks')