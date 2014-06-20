if(location.hostname == "news.ycombinator.com") {
    var spacerImages = document.getElementsByTagName("img");
    var comments = Array.prototype.slice.call(spacerImages).filter(function (e) {
        return ((e.src == "https://news.ycombinator.com/s.gif") && (e.width % 40 == 0) && (e.height == 1)); 
    });
    comments = comments.map(function(e) {
        return { 'depth': e.width/40, // Integer
                 'rowele': e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, // HTML <tr> for the comment
                 'txt': e.parentElement.parentElement.lastChild.children[2] }; // HTML <span> for the comment. Comment text enclosed
    });
    if(typeof(__flathn__) == "undefined") {
        __flathn__ = true;
        for(var i=0;i < comments.length; i++) {
            if(comments[i].depth > 1) {
                comments[i].rowele.style.display = "none";
            }
            if(comments[i].depth == 1) {
                comments[i].txt.style.fontSize = "0.7em";
            }
        } 
    } else {
        delete __flathn__;
        for(var i=0;i < comments.length; i++) {
            comments[i].rowele.style.display = "";
            comments[i].txt.style.fontSize = "";
        }
    }
} else {
    alert("This works with only Hacker News. Goto news.ycombinator.com and try again.");
}
