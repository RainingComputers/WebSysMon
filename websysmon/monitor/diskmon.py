import os

import time
import threading

import psutil

from .bytes2human import bytes2human

_bytes_read = 0
_bytes_write = 0

def _update_bytes_per_sec():
    while(True):
        global _bytes_read
        global _bytes_write
        
        # Get bytes recieved and sent
        disk_status = psutil.disk_io_counters()
        bytes_read_before = disk_status.read_bytes
        bytes_write_before = disk_status.write_bytes

        # Sleep for 1/10 second
        time.sleep(0.1)

        # Get bytes recieved and sent
        disk_status = psutil.disk_io_counters()
        bytes_read_after = disk_status.read_bytes
        bytes_write_after = disk_status.write_bytes

        # Calculate delta
        _bytes_read = (bytes_read_after - bytes_read_before)*10
        _bytes_write = (bytes_write_after - bytes_write_before)*10

def init_monitor():
    '''
    Initilize monitor module
    '''
    # Start thread that keeps calculating bytes/sec sent or received
    t = threading.Thread(target=_update_bytes_per_sec)
    t.start()

def bytes_read():
    '''
    returns number of bytes per second read
    '''
    return _bytes_read

def bytes_write():
    '''
    return number of bytes per second written
    '''
    return _bytes_write

def disk_summary():
    # Get disk info
    disk_info = []
    keys = ['device', 'mountpoint', 'fstype', 'opts', 'size']

    for part in psutil.disk_partitions(all=False):
        if(os.name == 'nt'):
            if 'cdrom' in part.opts or part.fstype == '':
                # skip cd-rom drives with no disk in it, they may raise
                # ENOENT, pop-up a Windows GUI error for a non-ready
                # partition or just hang.
                continue

        try:    
            size = bytes2human(psutil.disk_usage(part.mountpoint).total)
        except PermissionError:
            size = 'Permission Denied'

        disk_info.append(dict(zip(keys, list(part)+[size])))

    # Get disk usage info
    disk_usage = {}
    
    for disk in disk_info:
        try:
            mountpoint = disk['mountpoint'] 
            disk_usage[mountpoint] = bytes2human(psutil.disk_usage(mountpoint).free)
        except PermissionError:
            disk_usage[mountpoint] = 'Permission Denied'

    return disk_info, disk_usage

     
