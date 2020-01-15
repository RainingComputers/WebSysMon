from flask import Flask, render_template, jsonify
from websysmon import app

from .monitor import systemmon
from .monitor import networkmon
from .monitor import diskmon
from .monitor import bytes2human

from .monitor import PROCESSOR, CORE_COUNT, ARCHITECTURE
from .monitor import OPERATING_SYS, MEMORY

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/monitor', methods=['GET'])
def getstatus():
    core_count = CORE_COUNT

    cpu_usage = systemmon.cpu_usage()
    mem_usage = systemmon.memory_usage()
    swap_usage = systemmon.swap()
    cpu_freq = systemmon.cpu_freq()
    
    net_recv = networkmon.bytes_recv()
    net_sent = networkmon.bytes_sent()
    
    disk_read = diskmon.bytes_read()
    disk_write = diskmon.bytes_write()

    return jsonify(
        core_count=core_count, cpu_usage=cpu_usage, cpu_freq=cpu_freq,
        mem_usage=mem_usage, swap_usage=swap_usage, 
        net_recv=net_recv, net_sent=net_sent,
        disk_read=disk_read, disk_write=disk_write
    )

@app.route('/infopage')
def infopage():
    return render_template('infopage.html')

@app.route('/disks')
def getdisks():
    disk_info, disk_usage = diskmon.disk_summary()
    return jsonify(disk_info=disk_info, disk_usage=disk_usage)

@app.route('/info')
def getinfo():
    return jsonify(processor=PROCESSOR, core_count=CORE_COUNT,
        architecture=ARCHITECTURE, operating_sys=OPERATING_SYS, 
        memory=MEMORY)