# Utility function to convert number of bytes to string
def bytes2human(nbytes):
    if(nbytes < 1000): 
        return str(nbytes)+' Bytes'
    elif(nbytes < (1000**2)):
        return str(round(nbytes/1000, 2))+' KB'
    elif(nbytes < (1000**3)):
        return str(round(nbytes/(1000**2), 2))+' MB'
    elif(nbytes < (1000**4)):
        return str(round(nbytes/(1000**3), 2))+' GB'
    else:
        return str(round(nbytes/(1000**4), 2))+' TB'
