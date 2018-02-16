
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

export default {};
export { toggle_class, document_load };