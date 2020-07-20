const byId = function(id) { return document.getElementById(id); };

/* Create graph for network usage */
const net_graph = createGraph('netgraph', ['Bytes Received', 'Bytes Sent'], 'bytes/s', 'netlabels', 5, 1000);

function updateCharts(status)
{   
    /* Update network usage graph */
    net_graph.update([status['net_recv'], status['net_sent']]);
}

function updateNetIO(netio)
{
    net_io_table = byId('net-io-table');
    net_io_table.innerHTML = '';

    /* Grab template */
    net_io_item_template = document.querySelector('#net-io-item');
    net_io_item_X_template = document.querySelector('#net-io-item-X');

    /* Insert items */
    for(let netio_device of netio)
    {
        /* Clone template */
        const template_clone = net_io_item_template.content.cloneNode(true);

        /* Device name */
        template_clone.querySelector('p').textContent = netio_device['name'];

        /* Clone for RX */
        const template_clone_RX = net_io_item_X_template.content.cloneNode(true);

        /* RX details */
        template_clone_RX.querySelector('img').src = '/static/symbols/arrow-down-right.svg'
        template_clone_RX.querySelector('#dir').textContent = 'Received'
        template_clone_RX.querySelector('#packets').textContent = netio_device['packets_recv']
        template_clone_RX.querySelector('#bytes').textContent = netio_device['bytes_recv']
        template_clone_RX.querySelector('#errors').textContent = netio_device['errin']
        template_clone_RX.querySelector('#dropped').textContent = netio_device['dropin']
    
        /* Clone for TX */
        const template_clone_TX = net_io_item_X_template.content.cloneNode(true);
        
        /* TX details */
        template_clone_TX.querySelector('img').src = '/static/symbols/arrow-up-left.svg'
        template_clone_TX.querySelector('#dir').textContent = 'Sent'
        template_clone_TX.querySelector('#packets').textContent = netio_device['packets_sent'];
        template_clone_TX.querySelector('#bytes').textContent = netio_device['bytes_sent'];
        template_clone_TX.querySelector('#errors').textContent = netio_device['errout'];
        template_clone_TX.querySelector('#dropped').textContent = netio_device['dropout'];
    
        /* Append templates */
        template_clone.querySelector('#RX').appendChild(template_clone_RX);
        template_clone.querySelector('#TX').appendChild(template_clone_TX);

        /* Append to document */
        net_io_table.appendChild(template_clone);
    
    }
}

function updateNetstat(netstat)
{
    netstat_table = byId('netstat-table');
    netstat_table.innerHTML = '';

    /* Grab template */
    netstat_item_template = document.querySelector('#netstat-item');
    
    for(let stat of netstat)
    {
        /* Clone template */
        const template_clone = netstat_item_template.cloneNode(true);
    
        /* Insert content */
        template_clone.querySelector('#app').textContent = stat['name'];
        template_clone.querySelector('#status').textContent = stat['status'];
        template_clone.querySelector('#laddr').textContent = stat['laddr'];
        template_clone.querySelector('#proto').textContent = stat['proto'];
        template_clone.querySelector('#raddr').textContent = stat['raddr'];
        template_clone.querySelector('#pid').textContent = stat['pid'];

        /* Append to document */
        netstat_table.appendChild(template_clone);
    }
}

function intervalUpdate()
{
    getJSONAndCall(updateCharts, '/monitor');
    getJSONAndCall(updateNetIO, '/netio');
    getJSONAndCall(updateNetstat, '/netstat');
}

intervalUpdate();

/* Update values every second */
setInterval(intervalUpdate, 1000);