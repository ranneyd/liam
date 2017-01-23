{
    // window.location.search is the get parameter string starting with ?. Substring(1) kills the ?
    let getParams = window.location.search.substring(1);

    let siteName = getParams.match(/sitename=([^&]*)/)[1];
    $(".site-name").text(siteName);

    $("#backButton").click(function(){

    });
    $("#goButton").click(function(){

    });
    $("#saveButton").click(function(){

    });
}