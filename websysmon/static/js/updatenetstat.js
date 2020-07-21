/* Create graph for network usage */
const netGraph = createGraph('netgraph', ['Bytes Received', 'Bytes Sent'], 'bytes/s', 'netlabels', 5, 1000);

function updateCharts(status)
{   
    /* Update network usage graph */
    netGraph.update([status['net_recv'], status['net_sent']]);
}

function updateNetIO(netio)
{
    netIOTable = byId('net-io-table');
    netIOTable.innerHTML = '';

    /* Grab template */
    netIOItemTemplate = document.querySelector('#net-io-item');
    netIOItem_XTemplate = document.querySelector('#net-io-item-X');

    /* Insert items */
    for(let netioDevice of netio)
    {
        /* Clone template */
        const templateClone = netIOItemTemplate.content.cloneNode(true);

        /* Device name */
        templateClone.querySelector('p').textContent = netioDevice['name'];

        /* Clone for RX */
        const templateCloneRX = netIOItem_XTemplate.content.cloneNode(true);

        /* RX details */
        templateCloneRX.querySelector('img').src = '/static/symbols/arrow-down-right.svg'
        templateCloneRX.querySelector('#dir').textContent = 'Received'
        templateCloneRX.querySelector('#packets').textContent = netioDevice['packets_recv']
        templateCloneRX.querySelector('#bytes').textContent = netioDevice['bytes_recv']
        templateCloneRX.querySelector('#errors').textContent = netioDevice['errin']
        templateCloneRX.querySelector('#dropped').textContent = netioDevice['dropin']
    
        /* Clone for TX */
        const templateCloneTX = netIOItem_XTemplate.content.cloneNode(true);
        
        /* TX details */
        templateCloneTX.querySelector('img').src = '/static/symbols/arrow-up-left.svg'
        templateCloneTX.querySelector('#dir').textContent = 'Sent'
        templateCloneTX.querySelector('#packets').textContent = netioDevice['packets_sent'];
        templateCloneTX.querySelector('#bytes').textContent = netioDevice['bytes_sent'];
        templateCloneTX.querySelector('#errors').textContent = netioDevice['errout'];
        templateCloneTX.querySelector('#dropped').textContent = netioDevice['dropout'];
    
        /* Append templates */
        templateClone.querySelector('#RX').appendChild(templateCloneRX);
        templateClone.querySelector('#TX').appendChild(templateCloneTX);

        /* Append to document */
        netIOTable.appendChild(templateClone);
    
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
        if(stat['pid'] === '-') continue;

        /* Clone template */
        const templateClone = netstat_item_template.cloneNode(true);
    
        /* Insert content */
        templateClone.querySelector('#app').textContent = stat['name'];
        templateClone.querySelector('#status').textContent = stat['status'];
        templateClone.querySelector('#laddr').textContent = stat['laddr'];
        templateClone.querySelector('#proto').textContent = stat['proto'];
        templateClone.querySelector('#raddr').textContent = stat['raddr'];
        templateClone.querySelector('#pid').textContent = stat['pid'];

        /* Append to document */
        netstat_table.appendChild(templateClone);
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