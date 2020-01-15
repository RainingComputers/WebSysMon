var byId = function(id) { return document.getElementById(id); };

var graphs = {};

/* Function to initialize graphs */
function initGraph(status)
{   
    /* Create labels for CPU cores */
    cpulabels = []
    for(i = 0; i < status["core_count"]; i++) { cpulabels[i] = "CPU" + i; }
    
    /* Create graph for cpu usage */
    cpu_graph = createGraph("cpugraph", cpulabels, "%", "cpulabels", 5, 100);

    /* Create graph for CPU speed */
    cpuspeed_graph = createGraph("cpuspeedgraph", cpulabels, "MHz", "cpuspeedlabels", 5, 100);

    /* Create graph for memory usage */
    mem_graph = createGraph("memgraph", ["Memory", "Swap"], "%", "memlabels", 5, 100);

    /* Create graph for network usage */
    net_graph = createGraph("netgraph", ["Bytes Received", "Bytes Sent"], "bytes/s", "netlabels", 5, 1000);

    /* Create graph for disk usage */
    disk_graph = createGraph("diskgraph", ["Bytes Read", "Bytes Written"], "bytes/s", "disklabels", 5, 1000);

    /* Make graph object */
    graphs = {cpu:cpu_graph, cpuspeed:cpuspeed_graph, mem:mem_graph, net:net_graph, disk:disk_graph};
}

function updateCharts(status)
{
    /* Update CPU usage graph */
    for(i = 0; i < status["core_count"]; i++)
    {
        graphs["cpu"].update(status["cpu_usage"][i], i);
    }  

    /* Update CPU speed graph */
    for(i = 0; i < status["core_count"]; i++)
    {
        graphs["cpuspeed"].update(status["cpu_freq"][i], i);
    }  

    /* Update memory usage graph */
    graphs["mem"].update(status["mem_usage"], 0);
    graphs["mem"].update(status["swap_usage"], 1);
    
    /* Update network usage graph */
    graphs["net"].update(status["net_recv"], 0);
    graphs["net"].update(status["net_sent"], 1);

    /* Update disk usage */
    graphs["disk"].update(status["disk_read"], 0);
    graphs["disk"].update(status["disk_write"], 1);

}

function intervalUpdate()
{
    getJSONAndCall(updateCharts, '/monitor');
}

/* Initialize graphs */
getJSONAndCall(initGraph, '/monitor');

/* Update values every second */
setInterval(intervalUpdate, 1000);