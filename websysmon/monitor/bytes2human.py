# Utility function to convert number of bytes to string
def bytes2human(nbytes):
    if(nbytes < (1024*1024*1024)):
        return str(round(nbytes/(1024*1024), 2))+' MiB'
    else :
        return str(round(nbytes/(1024*1024*1024), 2))+' GiB'
