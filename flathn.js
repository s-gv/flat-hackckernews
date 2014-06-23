if(location.hostname == "news.ycombinator.com") {
    var reducedFontSize = "0.8em";
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
                var pTag = document.createElement('p');
                pTag.setAttribute('class', "showmore");
                var aTag = document.createElement('a');
                aTag.setAttribute('href',"#");
                aTag.innerHTML = "Show More";
                aTag.addEventListener("click", (function(n) {
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
                        event.preventDefault();
                    }
                })(i), true);
                pTag.appendChild(aTag);
                // Don't display "reply" to deeper comments
                if(comments[i].txt.lastChild.textContent == "reply")
                    comments[i].txt.lastChild.style.display = "none";
                if(comments[i].txt.parentElement.lastChild.textContent == "reply")
                    comments[i].txt.parentElement.lastChild.style.display = "none";
                if(i < (comments.length - 1)) {
                    if(comments[i+1].depth > comments[i].depth) {
                        // Display "Show More" only if there is something more to see.
                        comments[i].txt.appendChild(pTag);
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
