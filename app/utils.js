
function document_load(callback){
	document.addEventListener('DOMContentLoaded', callback);
}

function toggle_class(element, class_name, enable_class)
{
    if (enable_class)
    {
        element.classList.add(class_name);
    }
    else
    {
        element.classList.remove(class_name);
    }
}

function setup_textbox(element, param){

    if (param.callback){
        element.addEventListener("blur", param.callback);
        element.addEventListener("change", param.callback);
        element.addEventListener("keyup", () => delay(param.callback));
        element.addEventListener("focus", () => onfocus(element));    
    }

    if (param.type)
        element.setAttribute("type", param.type);
    if (param.max !== undefined)
        element.setAttribute("max", param.max);
    if (param.min !== undefined)
        element.setAttribute("min", param.min);
    if (param.value !== undefined)
        element.value = param.value;
}

function onfocus(element){
    window.setTimeout(() => {
        try{
            element.select();
            element.setSelectionRange(0, 9999);
        } catch (e) {}
    }, 50);
}

var timeout;
function delay(callback, milliseconds){
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callback, milliseconds || 1500);
}
        
export default {};
export { toggle_class, document_load, setup_textbox };