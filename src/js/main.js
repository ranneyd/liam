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
        console.log(chrome.extension, 'This is the chrom.extension');
        console.log(chrome.extension.getBackgroundPage(), 'This is the chrom.extension background page');
        console.log(chrome.extension.getBackgroundPage().lastRequest, 'This is the chrom.extension background page lastRequest');

        chrome.extension.getBackgroundPage().saveItem(chrome.extension.getBackgroundPage().lastRequest);
    });
}
