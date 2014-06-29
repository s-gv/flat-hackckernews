if(location.hostname == "news.ycombinator.com") {
    var reducedFontSize = ""; // change to "0.8em" or so to reduce font size of comments.
    var spacerImages = document.getElementsByTagName("img"); // get all images because HN uses a small image for indenting
    var comments = Array.prototype.slice.call(spacerImages).filter(function (e) {
        // filter only spacer images to get near comments.
        // spacer images have widths as multiples of 40
        // Chrome returns height as 2 and Firefox as 1. So accept both.
        return ((e.src == "https://news.ycombinator.com/s.gif") && (e.width % 40 == 0) && (e.height == 1||e.height == 2)); 
    });
    comments = comments.map(function(e) {
        return { 'depth': e.width/40, // Integer indicating depth of comment. depth = 0 is the main commet, 1 are replies to it etc.
            'rowele': e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, // HTML <tr> for the comment
             'txt': e.parentElement.parentElement.lastChild.children[2] }; // HTML <span> for the comment. Comment text enclosed in this span
    });
    if(typeof(__flathn__) == "undefined") {
        __flathn__ = true;
        for(var i=0;i < comments.length; i++) {
            if(comments[i].depth > 1) {
                // Don't display comments with depth > 1
                comments[i].rowele.style.display = "none";
            }
            if(comments[i].depth >= 1) {
                // Create a "Show More" HTML element
                var uTag = document.createElement('u');
                uTag.setAttribute('class', "showmore");
                var aTag = document.createElement('a');
                aTag.setAttribute('href',"#"+Math.round(1e9*Math.random()));  // add random number to prevent link greying out as visited.
                aTag.innerHTML = "more";
                aTag.addEventListener("click", (function(n, moreElement) {
                    return function(event) {
                        // User really wants to see this. Show the deeper comments at smaller font.
                        for(var j=n+1; j < comments.length; j++) {
                            if(comments[j].depth < (comments[n].depth + 1)) {
                                break;
                            }
                            if(comments[j].depth == (comments[n].depth + 1)) {
                                comments[j].rowele.style.display = ""; // show the row
                                comments[j].txt.lastChild.style.display = ""; // Show "reply"
                                comments[j].txt.parentElement.lastChild.style.display = "";
                            }
                        }
                        moreElement.style.display = "none"; // Don't show "More" anymore.
                        event.preventDefault();
                    }
                })(i, uTag), true);
                uTag.appendChild(aTag);
                // Display "Show More" only if there is something more to see.
                if(i < (comments.length - 1)) {
                    if(comments[i+1].depth > comments[i].depth) {
                        // "reply" seems to get associated with different parents occasionally 
                        if(comments[i].txt.lastChild.textContent == "reply") {
                            var replyParent = comments[i].txt.lastChild.children[0];
                        }
                        if(comments[i].txt.parentElement.lastChild.textContent == "reply") {
                            var replyParent = comments[i].txt.parentElement.lastChild.children[0];
                        }
                        // Add a "more" link to see deeper comments
                        replyParent.innerHTML += "&nbsp;";
                        replyParent.appendChild(uTag);
                    }
                }
                // Reduce font size for deeper comments
                comments[i].txt.style.fontSize = reducedFontSize; // reduce font size of depth=1 comment
                comments[i].txt.parentElement.children[0].children[0].style.fontSize = reducedFontSize;
            }
        } 
    } else {
        delete __flathn__;
        var showmores = document.getElementsByClassName("showmore");
        while(showmores.length > 0) {
            showmores[0].parentNode.removeChild(showmores[0]);
        }
        for(var i=0;i < comments.length; i++) {
            comments[i].rowele.style.display = "";
            if(comments[i].depth >= 1) {
                // Reset font-size and display props of all comments
                comments[i].txt.style.fontSize = "";
                comments[i].txt.parentElement.children[0].children[0].style.fontSize = "";
                comments[i].txt.lastChild.style.display = "";
                comments[i].txt.parentElement.lastChild.style.display = "";
            }
        }
    }
} else {
    alert("This works with only Hacker News. Open a discussion at news.ycombinator.com and try again.");
}
