let graphs = {};

/* Function to initialize graphs */
function initGraph(status)
{   
    /* Create labels for CPU cores */
    const cpulabels = []
    for(i = 0; i < status["core_count"]; i++) { cpulabels[i] = "CPU" + i; }
    
    /* Create graph for cpu usage */
    const cpuGraph = createGraph("cpugraph", cpulabels, "%", "cpulabels", 5, 100);

    /* Create graph for memory usage */
    const memGraph = createGraph("memgraph", ["Memory", "Swap"], "%", "memlabels", 5, 100);

    /* Create graph for disk usage */
    const diskGraph = createGraph("diskgraph", ["Bytes Read", "Bytes Written"], "bytes/s", "disklabels", 5, 1000);

    /* Make graph object */
    graphs = {cpu:cpuGraph, mem:memGraph, disk:diskGraph};
}

function updateCharts(status)
{
    /* Update CPU usage graph */
    graphs["cpu"].update(status["cpu_usage"]);

    /* Update memory usage graph */
    graphs["mem"].update([status["mem_usage"], status["swap_usage"]]);

    /* Update disk usage */
    graphs["disk"].update([status["disk_read"], status["disk_write"]]);

}

function updateProcstat(procstat)
{
    procstat_table = byId('proclist-table');
    procstat_table.innerHTML = '';

    /* Grab template */
    procstat_item_template = document.querySelector('#proclist-item');
    
    procstat.sort((a,b)=>b['cpu_percent']-a['cpu_percent']);

    for(let stat of procstat)
    {
        /* Check for filter text */
        let filter = byId("filter-txt").value
        let matches = false;

        if(filter != '')
        {
            for (let key of ['pid', 'nice']) 
            {
                if(stat[key] === Number(filter))
                {
                    matches = true;
                }
            }

            for (let key of ['name', 'username']) 
            {
                if(String(stat[key]).includes(filter))
                {
                    matches = true;
                }
            }

            if(!matches) continue;
        }

        /* Clone template */
        const templateClone = procstat_item_template.cloneNode(true);
    
        /* Insert content */
        templateClone.querySelector('#app').textContent = stat['name'];
        templateClone.querySelector('#pid').textContent = stat['pid'];
        templateClone.querySelector('#cpu').textContent = Math.round(stat['cpu_percent'], 2)+'%';
        templateClone.querySelector('#mem').textContent = Math.round(stat['memory_percent'], 2)+'%';
        templateClone.querySelector('#nice').textContent = stat['nice'];
        templateClone.querySelector('#user').textContent = stat['username'];

        if(stat['io_counters'] != null)
        {
            templateClone.querySelector('#read').textContent = bytes2human(stat['io_counters'][2]);
            templateClone.querySelector('#write').textContent = bytes2human(stat['io_counters'][3]);
        }
        else
        {
            templateClone.querySelector('#read').textContent = '-';
            templateClone.querySelector('#write').textContent = '-';
        }

        
        /* Append to document */
        procstat_table.appendChild(templateClone);
    }
}

function intervalUpdate()
{
    getJSONAndCall(updateCharts, '/monitor');
    getJSONAndCall(updateProcstat, '/proclist');
}

/* Utility function to convert number of bytes to string */
function bytes2human(nbytes)
{
    if(nbytes < 1024)
        return nbytes + ' bytes'
    else if(nbytes < (1024*1024))
        return Math.round(nbytes/1024, 2) + ' KiB'
    else if(nbytes < (1024*1024*1024))
        return Math.round(nbytes/(1024*1024), 2) + ' MiB'
    else
        return Math.round(nbytes/(1024*1024*1024), 2) + ' GiB'
}


/* Initialize graphs */
getJSONAndCall(initGraph, '/monitor');

/* Update values every second */
intervalUpdate();
setInterval(intervalUpdate, 1000);

createDropdown('filter-dropdown', 'filter-dropbtn', 'dropdown-content', 'dropdown-show', 'filter-dropdown-close');