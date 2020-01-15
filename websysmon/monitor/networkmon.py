import psutil
import time
import threading

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

