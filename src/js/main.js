{   
    // TODO: Make whole url.
    $(".site-name").text(chrome.extension.getBackgroundPage().host);

    $("#backButton").click(function(){
        console.log("back");
    });

    $("#goButton").click(function(){
        console.log("go");
        
    });

    $("#saveButton").click(function(){
        console.log("save");
        chrome.extension.getBackgroundPage().saveItem(chrome.extension.getBackgroundPage().lastRequest);
    });
}
