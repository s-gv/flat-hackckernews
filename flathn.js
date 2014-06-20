if(location.hostname == "news.ycombinator.com") {
    var spacerImages = document.getElementsByTagName("img");
    var comments = Array.prototype.slice.call(spacerImages).filter(function (e) {
        return ((e.src == "https://news.ycombinator.com/s.gif") && (e.width % 40 == 0) && (e.height == 1)); 
    });
    comments = comments.map(function(e) {
        return { 'depth': e.width/40, 'ele': e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement };
    });
    if(typeof(__flathn__) == "undefined") {
        __flathn__ = true;
        for(var i=0;i < comments.length; i++) {
            if(comments[i].depth != 0) {
                comments[i].ele.style.display = "none";
            }
        } 
    } else {
        delete __flathn__;
        for(var i=0;i < comments.length; i++) {
            comments[i].ele.style.display = "";
        }
    }
} else {
    alert("This works with only Hacker News. Goto news.ycombinator.com and try again.");
}
