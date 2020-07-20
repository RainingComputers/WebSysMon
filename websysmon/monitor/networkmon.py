import socket
from socket import AF_INET, SOCK_STREAM, SOCK_DGRAM

import psutil
import time
import threading

from .bytes2human import bytes2human

_bytes_persec_recv = 0
_bytes_persec_sent = 0

def _update_bytes_per_sec():
    while(True):
        global _bytes_persec_recv
        global _bytes_persec_sent
        
        # Get bytes recieved and sent
        network_status = psutil.net_io_counters()
        net_recv_before = network_status.bytes_recv
        net_sent_before = network_status.bytes_sent

        # Sleep for 1/10 second
        time.sleep(0.1)

        # Get bytes recieved and sent
        network_status = psutil.net_io_counters()
        net_recv_after = network_status.bytes_recv
        net_sent_after = network_status.bytes_sent

        # Calculate delta
        _bytes_persec_recv = (net_recv_after - net_recv_before)*10
        _bytes_persec_sent = (net_sent_after - net_sent_before)*10

def init_monitor():
    '''
    Initilize monitor module
    '''
    # Start thread that keeps calculating bytes/sec sent or received
    t = threading.Thread(target=_update_bytes_per_sec)
    t.start()

def bytes_sent():
    '''
    returns number of bytes per second sent
    '''
    return _bytes_persec_sent

def bytes_recv():
    '''
    returns number of bytes per second received
    '''
    return _bytes_persec_recv

def net_io():
    nics = psutil.net_io_counters(pernic=True)

    net_io_dict = []

    for nic in nics.keys():
        net_io_dict.append({
            'name':nic,
            'packets_sent':nics[nic].packets_sent,
            'packets_recv':nics[nic].packets_recv,
            'bytes_sent':bytes2human(nics[nic].bytes_sent),
            'bytes_recv':bytes2human(nics[nic].bytes_recv),
            'errout':nics[nic].errout,
            'errin':nics[nic].errin,
            'dropout':nics[nic].dropout,
            'dropin':nics[nic].dropin,
        })

    return net_io_dict

def net_stat():
    net_stat_dict = []

    AD = "-"
    AF_INET6 = getattr(socket, 'AF_INET6', object())
    proto_map = {
        (AF_INET, SOCK_STREAM): 'tcp',
        (AF_INET6, SOCK_STREAM): 'tcp6',
        (AF_INET, SOCK_DGRAM): 'udp',
        (AF_INET6, SOCK_DGRAM): 'udp6',
    }

    proc_names = {}
    for p in psutil.process_iter(['pid', 'name']):
        proc_names[p.info['pid']] = p.info['name']
    for c in psutil.net_connections(kind='inet'):
        laddr = "%s:%s" % (c.laddr)
        raddr = ""
        if(c.raddr): raddr = "%s:%s" % (c.raddr)
        net_stat_dict.append({
            'proto':proto_map[(c.family, c.type)],
            'laddr':laddr,
            'raddr':raddr or AD,
            'status':c.status,
            'pid':c.pid or AD,
            'name':proc_names.get(c.pid, '?')[:15],
        })

    return net_stat_dict
