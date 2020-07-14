from pathlib import Path
import platform

import psutil
import cpuinfo

from . import systemmon
from . import networkmon
from . import diskmon

from .bytes2human import bytes2human

# Get system info
_info = cpuinfo.get_cpu_info()
PROCESSOR = _info['brand']
CORE_COUNT = _info['count']
ARCHITECTURE = _info['arch']
OPERATING_SYS = platform.system() + ' ' + platform.release()
MEMORY = bytes2human(psutil.virtual_memory().total)
HOMEDIR = str(Path.home())

# Start system monitor
systemmon.init_monitor()
# Start network monitor
networkmon.init_monitor()
# Start disk monitor
diskmon.init_monitor()