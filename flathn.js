if(location.hostname == "news.ycombinator.com") {
    var spacerImages = document.getElementsByTagName("img"); // get all images because HN uses a small image for indenting
    var comments = Array.prototype.slice.call(spacerImages).filter(function (e) {
        // filter only spacer images to get near comments.
        // spacer images have widths as multiples of 40
        // Chrome returns height as 2 and Firefox as 1. So accept both.
        return ((e.src == "https://news.ycombinator.com/s.gif") && (e.width % 40 == 0) && (e.height == 1||e.height == 2)); 
    });
    var searchChildrenByClassName = function(node, name) {
        if(node.className == name) {
            return node;
        }
        for(var i=0;i < node.children.length; i++) {
            var result = searchChildrenByClassName(node.children[i], name);
            if(result != null) {
                return result;
            }
        }
        return null;
    };
    comments = comments.map(function(e) {
        var commentRow = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        var replyDiv = searchChildrenByClassName(commentRow, "reply");
        var replyParent = null;
        if(replyDiv != null) {
            if(replyDiv.lastChild != null) {
                replyParent = replyDiv.lastChild.children[0];
            }
        }
        return { 
            'depth': e.width/40, // Integer indicating depth of comment. depth = 0 is the main commet, 1 are replies to it etc.
            'rowele': commentRow, // HTML <tr class="athing"> for the comment.
            'replyparent': replyParent, // HTML <font> that contains the "reply" button.
            'morelessele': null // innerHTML of this element is "more" or "less".
        };
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
                        if(moreElement.firstChild.innerHTML == "more") {
                            // User really wants to see deeper comments. Show the deeper comments.
                            for(var j=n+1; j < comments.length; j++) {
                                if(comments[j].depth < (comments[n].depth + 1)) {
                                    break;
                                }
                                if(comments[j].depth == (comments[n].depth + 1)) {
                                    comments[j].rowele.style.display = ""; // show the row
                                }
                            }
                            moreElement.firstChild.innerHTML = "less";
                        } else {
                            // User clicked on "less" and doesn't want deeper comments
                            for(var j=n+1; j < comments.length; j++) {
                                if(comments[j].depth < (comments[n].depth + 1)) {
                                    break;
                                }
                                if(comments[j].depth >= (comments[n].depth + 1)) {
                                    comments[j].rowele.style.display = "none"; // hide the row
                                    if(comments[j].morelessele != null) {
                                        comments[j].morelessele.innerHTML = "more";
                                    }
                                }
                            }
                            moreElement.firstChild.innerHTML = "more";
                        }
                        event.preventDefault();
                    }
                })(i, uTag), true);
                uTag.appendChild(aTag);
                // Display "Show More" only if there is something more to see.
                if(i < (comments.length - 1)) {
                    if(comments[i+1].depth > comments[i].depth) {
                        if(comments[i].replyparent != null) { // replyparent will be null for [deleted] comments
                            comments[i].replyparent.appendChild(uTag);
                            comments[i].morelessele = comments[i].replyparent.lastChild.lastChild;
                        }
                    }
                }
            }
        } 
    } else {
        delete __flathn__;
        var showmores = document.getElementsByClassName("showmore");
        while(showmores.length > 0) {
            showmores[0].parentElement.removeChild(showmores[0]);
        }
        for(var i=0;i < comments.length; i++) {
            comments[i].rowele.style.display = "";
        }
    }
} else {
    alert("This works with only Hacker News. Open a discussion at news.ycombinator.com and try again.");
}
