

/** 
 * Google Studio Content Replacer
 * @Version 0.2b
 * @Peter Buza
 *
 * argument0: contentFields Object of placeholders e.g. {headline_1: 'Buy now',...}
 *
**/
function replaceContent(contentFields) {
    var elements = [];
    var value = "";
    var placeholder = "";
    var selector = "";
    var placeholders = Object.keys(contentFields);
    console.log("Dynamic Content loaded: ", contentFields);
    // Each in placeholders
    for (var i in placeholders) {
        placeholder = placeholders[i];
        value = contentFields[placeholder];
        selector = "#" + placeholder + ", ." + placeholder;
        elements = document.querySelectorAll(selector);
        // If queried elements not found for placeholder
        if (!elements || !elements.length) {
            console.warn("Elements not found for placeholder: ", placeholder);
            continue;
        }
        // Each in DOM elements
        for (var e = 0, element; element = elements[e]; e++) {
            try {
                // Replace images
                if (placeholder.indexOf("image") !== -1) {
                    // If tag is img set src if not set background image
                    if (element.tagName.toLowerCase() === "img") {
                        console.log(placeholder, "image placeholder found, set src to: ", value.Url);
                        element.src = value.Url;
                    } else {
                        console.log(placeholder, "image placeholder found, set background image to: ", value.Url);
                        element.style.backgroundImage = "url(\'" + value.Url + "\')";
                    }
                    continue;
                }
                // Replace urls if tag a
                if (placeholder.indexOf("url") !== -1) {
                    if (element.tagName.toLowerCase() === "a") {
                        var url = value.Url ? value.Url : value;
                        console.log(placeholder, "url placeholder found, set href to: ", url);
                        element.href = url;
                    }
                    continue;
                }
                // Replace colors
                if (placeholder.indexOf("color") !== -1) {
                    console.log(placeholder, "color placeholder found, set color to: ", value);
                    if (placeholder.indexOf("background") !== -1) {
                        element.style.backgroundColor = value;
                    } else {
                        element.style.color = value;
                    }
                    continue;
                }
                // Replace postions
                if (placeholder.indexOf("position") !== -1) {
                    console.log(placeholder, "positioning placeholder found, set background position to: ", value);
                    element.style.cssText += value;
                    continue;
                }
                // Replace text placeholders
                console.log(placeholder, "placeholder found, set inner text to: ", value);
                element.innerHTML = value.replace(/\n/g, "<br>");
                continue;
            } catch (error) {
                console.error("Error found when replace placeholder: ", placeholder, "Element: ", element, "Error Message: ", error);
            }
        }
    }
}