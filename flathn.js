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
                comments[i].rowele.style.display = "none";
            }
            if(comments[i].depth == 1) {
                var pTag = document.createElement('p');
                pTag.setAttribute('class', "showmore");
                var aTag = document.createElement('a');
                aTag.setAttribute('href',"#");
                aTag.innerHTML = "Show More";
                aTag.addEventListener("click", function(event) { 
                    alert("bar");
                    event.preventDefault();
                });
                pTag.appendChild(aTag);
                if(comments[i].txt.lastChild.textContent == "reply")
                    comments[i].txt.lastChild.style.display = "none";
                if(comments[i].txt.parentElement.lastChild.textContent == "reply")
                    comments[i].txt.parentElement.lastChild.style.display = "none";
                comments[i].txt.appendChild(pTag);
            }
            if(comments[i].depth >= 1) {
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
