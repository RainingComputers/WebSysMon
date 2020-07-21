/* Function to retreive JSON file */
function getJSONAndCall(updateFunction, url) 
{
    /* Retrive the json file from URL */
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            var status = JSON.parse(this.responseText);
            updateFunction(status);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}