let topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle",
    "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken", "capybara",
    "teacup pig", "serval", "ostrich", "salamander", "frog"];

let favArray = [];

function renderButtons() {
    $(".button-container").empty()
        .html(
            topics.map(function (topic) {
                return `<button class="topic-btn" data-topic="${topic}">${topic}</button>`
            })
                .join(``)
        );
}

function renderFavorites(favArray) {
    $(".favorites").empty();
    for (var k = 0; k < favArray.length; k++) {
        let favItem = favArray[k];
        console.log(favItem);
        $(".favorites").append(favItem);
    }
}

$(document).on("click", ".topic-btn", function () {
    $(".gif-container").empty();
    var chosenTopic = $(this).attr("data-topic");
    console.log(chosenTopic);

    let apiKey = '9OMI8GxD4qrbVLJ6Env1e5XXHytw7ki0';
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${chosenTopic}&api_key=${apiKey}&limit=10`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            let giffs = response.data;
            console.log(response.data);

            for (var k = 0; k < giffs.length; k++) {
                let gifDiv = $(`<div class="gif-cards">`);

                let rating = (giffs[k].rating).toUpperCase();

                let p = $(`<p>`).text(`Rating: ${rating}`);

                let gifImage = $(`<img>`);
                gifImage.attr("src", giffs[k].images.fixed_height_still.url)
                    .attr("data-still", giffs[k].images.fixed_height_still.url)
                    .attr("data-animate", giffs[k].images.fixed_height.url)
                    .attr("data-state", "still")
                    .attr("class", "gif");

                let favoriteBtn = $(`<button class="favorite">Fave</button>`);
                favoriteBtn.attr("data-fav", giffs[k].images.fixed_width.url)
                    .attr("data-fav-full", giffs[k].images.original.url)
                    .attr("data-object", giffs[k]);
                p.prepend(favoriteBtn);

                let buttonLink = giffs[k].url;
                let downloadBtn = $(`<button><a href=${buttonLink} download="animal.gif">Save</a></button>`);
                p.append(downloadBtn);

                gifDiv.prepend(gifImage);
                gifDiv.prepend(p);

                $(".gif-container").prepend(gifDiv);
            }
        }).catch(console.log);
})
    .on("mouseover", ".gif", function () {
        const state = $(this).attr("data-state");

        if (state === 'animate') {
            const url = $(this).attr("data-still");
            $(this).attr("data-state", "still");
            $(this).attr("src", url);
        } else {
            const url = $(this).attr("data-animate");
            $(this).attr("data-state", "animate");
            $(this).attr("src", url);
        }
    })
    .on("click", ".favorite", function () {
        let favURl = $(this).attr("data-fav");
        let favURLFull = $(this).attr("data-fav-full");
        let favcard = $(`<a href="${favURLFull}" target="_blank" class="fav">
                                <img src="${favURl}"></a>
                                <button class="rmFav">x</button>`);
        favArray.push(favcard);
        console.log(favArray);
        localStorage.setItem("FavoriteGifs", JSON.stringify(favArray));

        renderFavorites(favArray);
        /*$(".favorites").append(favcard);*/

    })
    .on("click", ".rmFav", function () {
        console.log(this);
        // let removeURL = this;
        $(".favorites").empty(this);
    });
/*    .on("click", '.download', function(){
        let downloadlink = $(this).attr("data-download");
        downloadlink.attr("download");
});*/


$(document).ready(function () {

    $("#add-topic").on("click", function (event) {

        event.preventDefault();

        const newTopic = $("#topic-input").val();
        topics.push(newTopic);

        renderButtons();
    });

    renderButtons();

/*    let favArray = JSON.parse(localStorage.getItem("FavoriteGifs"));

    if (!Array.isArray(favArray)){
        toDoArray = [];
    }

    renderFavorites(favArray);*/

    /*    $(".topic-btn").on("click", function() {
            var chosenTopic = $(this).attr("data-topic");
            console.log(chosenTopic);

            let queryURL = `https://api.giphy.com/v1/gifs/search?q=${chosenTopic}&api_key=9OMI8GxD4qrbVLJ6Env1e5XXHytw7ki0limit=10`

            $.ajax({
                url:queryURL,
                method: "GET"
            })
                .then(function(response) {
                    let giffs = response.data;
                    console.log(response.data);

                for (var k = 0; k < giffs.length; k++) {
                    let gifDiv = $("<div>");

                    let rating = (giffs[k].rating).toUpperCase();

                    let p = $("<p>").text(`Rating: ${rating}`);

                    let gifImage = $("<img>");
                    gifImage.attr("src", giffs[k].images.fixed_height.url);

                    gifDiv.prepend(p);
                    gifDiv.prepend(gifImage);

                    $(".gif-container").prepend(gifDiv);
                }
            }).catch(console.log);
        });*/

});