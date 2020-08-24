
 
/**
 * Google Studio Content Replacer
 * @Version 0.2b
 * @Peter Buza
 *
 *
 * Google Studio give you a fancy Object to your content but you must replace things in DOM to see. This code can do it.
 * 
 * Example:
 *
 * <div class="headline_1">Default headline text</div> 
 *                 ^
 *     Its replaced becouse of this
 *
 * <img src="default-background.jpg" id="background_image_1">
 *
 * If placeholder name contains:
 *      'image': If tag is an img replace src, if not replace background-image e.g background_image_1, product_image_1
 *      'url': Change src tag e.g product_url, click_url
 *      'background' and 'color': Background color e.g. background_color_1, background_color_footer
 *      'color': Text color e.g. headline_color, footer_color_text
 *      'position': Background position css text e.g background_position_1
 *      'visible': Display css e.g cta_visible (animations can overwrite it)
 *      'opacity': Opacity css e.g background_opacity, cta_opacity (animations can overwrite it)
 *      'css': Css text e.g. headline_css (animations can overwrite it)
 *
 *      If placeholder not contains these keys, its will replace content inside the tag
 *
 *      You can write placeholder names into the class="background_image_1" or id="product-image-1"
 *
 *
**/

// contentFields: Object of placeholders e.g. {headline_1: 'Buy now', background_image_1: '', ...}
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
        selector = [
            "#" + placeholder,
            "." + placeholder,
            "#" + placeholder.replace(/_/g, '-'), 
            "." + placeholder.replace(/_/g, '-')
        ].join(', ');

        elements = document.querySelectorAll(selector);

        // If queried elements not found for placeholder
        if (!elements || !elements.length) {
            console.warn("Elements not found for placeholder: ", placeholder, " selector: " + selector);
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

                // Hide element
                if (placeholder.indexOf("visible") !== -1) {
                    console.log(placeholder, "is ", value, ", " + (value ? "show" : "hide") + " elements");
                    element.style.display = value;
                    continue;
                }

                // Set opacity
                if (placeholder.indexOf("opacity") !== -1) {
                    console.log(placeholder, "opacity placeholder found");
                    element.style.opacity = value;
                    continue;
                }

                // Import css file
                if (placeholder.indexOf("css") !== -1) {
                    var file = location.pathname.split( "/" ).pop();
                    var link = document.createElement("link");
                    link.href = value;
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    document.getElementsByTagName("head")[0].appendChild(link);
                }

                // Set css
                if (placeholder.indexOf("style") !== -1) {
                    console.log(placeholder, "css placeholder found");
                    element.style.cssText += value;
                    continue;
                }

                // Replace text placeholders
                if (typeof value === 'string') {
                    console.log(placeholder, "placeholder found, set inner text to: ", value);
                    element.innerHTML = value.toString().replace(/\n/g, "<br>");
                    continue;
                }

                console.log(placeholder, "placeholder not used (DOM not changed)");


            } catch (error) {
                console.error("Error found when replace placeholder: ", placeholder, "Element: ", element, "Error Message: ", error);
            }
        }
    }
}