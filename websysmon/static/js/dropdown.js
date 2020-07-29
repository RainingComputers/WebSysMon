function createDropdown(dropdownID, dropdownButtonID, contentClass, displayClass, closeButtonID) 
{
    document.getElementById(dropdownButtonID).onclick = function(){toggleDropdown(dropdownID, displayClass)};
    window.addEventListener('click', function(){ 
        closeDropdown(dropdownID, dropdownButtonID, contentClass, displayClass, closeButtonID) 
    });
    document.getElementById(dropdownID).classList.remove(displayClass)
}

function toggleDropdown(dropdownID, displayClass)
{
    document.getElementById(dropdownID).classList.toggle(displayClass);
}

function closeDropdown(dropdownID, dropdownButtonID, contentClass, displayClass, closeButtonID) 
{
    if (!(isDescendant(event.target, dropdownButtonID) || isDescendant(event.target, dropdownID)) ||
        (isDescendant(event.target, closeButtonID) && closeButtonID != undefined)) 
    {
        const dropdowns = document.getElementsByClassName(contentClass);
        for (let i = 0; i < dropdowns.length; i++) 
        {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains(displayClass)) 
            {
                openDropdown.classList.remove(displayClass);
            }
        }
    }
}

function isDescendant(el, parentId) 
{ 
    if (el.id === parentId)
        return true;
  
    while (el = el.parentNode)
        if (el.id === parentId)
            return true;

    return false;
}