from pathlib import Path

from flask import Flask, render_template, jsonify, redirect, url_for, session, request
from websysmon import app

from .monitor import systemmon
from .monitor import networkmon
from .monitor import diskmon
from .monitor import bytes2human

from .monitor import PROCESSOR, CORE_COUNT, ARCHITECTURE
from .monitor import OPERATING_SYS, MEMORY, HOMEDIR

from .ls import ls

app.secret_key = '0aaf9678aced38ae602ea2be74af6ea71b4051de45a0144f'

@app.route('/')
@app.route('/infopage')
def infopage():
    return render_template('infopage.html')

@app.route('/monitorpage')
def monitorpage():
    return render_template('monitor.html')

@app.route('/filespage')
def filespage():
    return render_template('ls.html')

@app.route('/netstatpage')
def netstatpage():
    return render_template('netstat.html')

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

@app.route('/disks')
def getdisks():
    disk_info, disk_usage = diskmon.disk_summary()
    return jsonify(disk_info=disk_info, disk_usage=disk_usage)

@app.route('/info')
def getinfo():
    return jsonify(processor=PROCESSOR, core_count=CORE_COUNT,
        architecture=ARCHITECTURE, operating_sys=OPERATING_SYS, 
        memory=MEMORY, uptime=systemmon.uptime())

@app.route('/proclist')
def proclist():
    return jsonify(systemmon.proc_list())

@app.route('/netio')
def netio():
    return jsonify(networkmon.net_io())

@app.route('/netstat')
def netstat():
    return jsonify(networkmon.net_stat())

@app.route('/browse', defaults={'path':HOMEDIR})
@app.route('/browse/<path:path>')
@app.route('/browseparent/<path:path>')
@app.route('/togglehidden/<path:path>')
def browse(path):
    if('showhidden' not in session):
        session['showhidden'] = False

    path = path.replace('%20', ' ')
    if(path[0] != '/'): path = '/' + path
    
    if('browseparent' in request.url_rule.rule):
        path = str(Path(path).parent)
    elif('togglehidden' in request.url_rule.rule):
        session['showhidden'] = not session['showhidden']

    return jsonify({'hidden':session['showhidden'], 'path':path, 
        'items':ls(path, session['showhidden'])})
