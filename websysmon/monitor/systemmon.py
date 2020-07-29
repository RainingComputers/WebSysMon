import datetime
import time
import threading

import psutil

from .bytes2human import bytes2human

_cpu_usage = [0]*psutil.cpu_count()
_cpu_freq = [0]*psutil.cpu_count()
_mem_usage = 0
_swap_usage = 0

_proc_list = []
_proc_attrs = ['pid', 'name', 'username', 'cpu_percent', 'memory_percent', 
    'io_counters', 'nice']
_cpu_count = psutil.cpu_count()

def _update():
    while(True):
        last_time = time.time()

        global _cpu_usage
        global _mem_usage
        global _swap_usage
        global _cpu_freq

        global _proc_list
        _proc_list.clear()

        for p in psutil.process_iter():
            try:
                p.dict = p.as_dict(_proc_attrs)
            except psutil.NoSuchProcess:
                pass
            else:
                p.dict['cpu_percent'] = p.dict['cpu_percent']/_cpu_count
                _proc_list.append(p.dict)

        _cpu_usage = psutil.cpu_percent(percpu=True)
        _mem_usage = psutil.virtual_memory().percent
        _swap_usage = psutil.swap_memory().percent
        _cpu_freq = [freq.current for freq in psutil.cpu_freq(percpu=True)]

        while((time.time()-last_time) < 1): time.sleep(0.1)

def init_monitor():
    '''
    Initilize monitor module
    '''
    # Start thread that keeps updating values
    t = threading.Thread(target=_update)
    t.start()

def cpu_usage():
    '''
    returns list containing usage of each cpu
    '''
    return _cpu_usage

def cpu_freq():
    '''
    return list containing speed of each cpu
    '''
    return _cpu_freq

def memory_usage():
    '''
    returns memeory usage
    '''
    return _mem_usage

def swap():
    '''
    returns swap usage
    '''
    return _swap_usage
    
def uptime():
    '''
    returns system uptime
    '''
    boot = datetime.datetime.fromtimestamp(psutil.boot_time())
    now = datetime.datetime.now()
    delta = (now-boot)

    days = delta.days
    hours, rem = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(rem, 60)

    return f"{days} days, {hours} hours, {minutes} minutes, {seconds} seconds"

def proc_list():
    global _proc_list
    return _proc_list
