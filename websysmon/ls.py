import os
import datetime
import collections

from .monitor import bytes2human

# Named tuple for holding file details
Item = collections.namedtuple(
    'Item',
    'name, size, date, nbytes, isdir, ftype, path'
)

def ls(path, show_hidden=False):
    # Function for conveting bytes to KiB, MiB or GiB
    items = []

    for item in os.listdir(path):
        if(not show_hidden and item[0] == '.'): continue
        
        abs_item_path = os.path.join(path, item)
        name = item
        datemtime = os.path.getmtime(abs_item_path)
        date = datetime.datetime.fromtimestamp(datemtime).strftime('%Y-%m-%d %H:%M:%S')
        isdir = os.path.isdir(abs_item_path)
        nbytes = os.path.getsize(abs_item_path)
        
        if(not isdir):
            ftype = name.split('.')[-1].lower()
            size = bytes2human(nbytes)
        else:
            ftype = 'folder'
            size = str(len(os.listdir(abs_item_path)))+' Items'      

        items.append({
            'name':name, 'size':size, 'date':date, 'isdir':isdir, 
            'ftype':ftype, 'path':abs_item_path
        })

    return items