ajaxFunctions.ready(function() {
    var searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        ajaxFunctions.ajaxPostRequest("POST", "/search", {search: e.target.childNodes[1].childNodes[3].value}, function(data) {
            var data = JSON.parse(data);
            var businesses = JSON.parse(data.body).businesses;
            
            initializeUI(businesses, data.user.goingTo);
        })
    });
});
    