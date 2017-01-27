function initializeUI(bars, goingTo) {
    var barApiUrl = appUrl + '/api/:id/bar';

    var barContainer = document.querySelectorAll('.bar');

    barContainer.forEach(function(container) {
        container.parentNode.removeChild(container);
    });

    bars.forEach(function(bar) {
        var barContainer = document.createElement("div");
        barContainer.className = "col-lg-12 col-md-6 bar";

        var barMedia = document.createElement("div");
        barMedia.className = "media";

        var barMediaLeft = document.createElement("div");
        barMediaLeft.className = "media-left";

        var barMediaBody = document.createElement("div");
        barMediaBody.className = "media-body";

        var barName = document.createElement("h1");
        barName.className = "media-heading";
        barName.innerHTML = bar.name;

        var barImage = document.createElement("a");
        barImage.setAttribute("href", "#");

        var barRating = document.createElement("p");
        barRating.appendChild(document.createTextNode("Rating: " + bar.rating));
        var barPrice = document.createElement("p");
        barPrice.appendChild(document.createTextNode("Pricing: " + bar.price));

        var barImageContent = document.createElement("img");
        barImageContent.setAttribute("src", bar.image_url);
        barImageContent.setAttribute("alt", bar.name);
        barImageContent.className = "media-object media-middle img-rounded";

        var newButton = document.createElement("button");
        newButton.className = "btn btn-bar media-object media-heading";
        newButton.innerHTML = "Waiting for data";
        newButton.setAttribute("data-id", bar.id);

        newButton.addEventListener('click', function(e) {

            ajaxFunctions.ajaxPostRequest('POST', barApiUrl, {
                "goingTo": e.target.getAttribute('data-id')
            }, function() {
                ajaxFunctions.ajaxRequest('GET', barApiUrl, updateBars);
            });

        }, false);

        barImage.appendChild(barImageContent);
        barMediaBody.appendChild(barName);
        barMediaBody.appendChild(newButton);
        barMediaBody.appendChild(barRating);
        barMediaBody.appendChild(barPrice);

        barMediaLeft.appendChild(barImage);
        barMedia.appendChild(barMediaLeft);
        barMedia.appendChild(barMediaBody);
        barContainer.appendChild(barMedia);

        document.getElementById("main").appendChild(barContainer);
    });
    updateBars(goingTo);
}

function updateBars(goingTo) {
    var barButtons = document.querySelectorAll('.btn-bar');

    barButtons.forEach(function(button) {
        var barId = button.getAttribute('data-id');

        if (goingTo.indexOf(barId) >= 0) {
            button.innerHTML = "Going";
        }
        else {
            button.innerHTML = "Not Going";
        }
    });
}
