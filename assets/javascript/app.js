// The array for our initial buttons to be loaded when the window opens, for the sake of simplicity I just used animals
let topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle",
    "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken", "capybara",
    "teacup pig", "serval", "ostrich", "salamander", "frog"];

// This is the offset counter so that when you wish to load more gifs from the site, you get new ones.
let offsetNum = 0;

// Functions ===========================================================================================================
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

    for (var n = 0; n < favArray.length; n++) {
        let favCard = $(`<a href="${favArray[n].link}" target="_blank" class="fav">
                        <img src="${favArray[n].thumbnail}"></a>
                        <button class="rmFav" data-delete="${n}">x</button>
                        `);


        $(".favorites").append(favCard);
    }
}

function queryGiphy(topic) {

    let apiKey = '9OMI8GxD4qrbVLJ6Env1e5XXHytw7ki0';
    let queryOffset = `&offset=${offsetNum}`;
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${apiKey}&limit=10${queryOffset}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            let giffs = response.data;
            // console.log(response.data);

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

                let favoriteBtn = $(`<button class="favorite">Fav</button>`);
                favoriteBtn.attr("data-fav", giffs[k].images.fixed_width.url)
                    .attr("data-fav-full", giffs[k].images.original.url)
                    .attr("data-object", giffs[k]);

                p.append(favoriteBtn);

                gifDiv.prepend(gifImage);
                gifDiv.prepend(p);

                $(".gif-container").append(gifDiv);
            }
        }).catch(console.log);

    $(".more-button").append($(`<button class="show-more" data-topic="${topic}">Show Me More!</button>`));
    offsetNum += 10;
    console.log(offsetNum);
}


$(document).on("click", ".topic-btn", function () {
    offsetNum = 0;
    console.log(offsetNum);
    $(".gif-container, .more-button").empty();
    var chosenTopic = $(this).attr("data-topic");
    // console.log(chosenTopic);

    queryGiphy(chosenTopic);
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
        let fav = {};

        fav.thumbnail = $(this).attr("data-fav");

        fav.link = $(this).attr("data-fav-full");

        favArray.push(fav);

        localStorage.setItem("FavoriteGifs", JSON.stringify(favArray));

        renderFavorites(favArray);
    })

    .on("click", ".rmFav", function () {
        let rmArray = $(this).attr("data-delete");
        favArray.splice(rmArray, 1);

        localStorage.setItem("FavoriteGifs", JSON.stringify(favArray));

        renderFavorites(favArray);
    })

    .on("click", ".show-more", function () {
        var chosenTopic = $(this).attr("data-topic");
        this.remove();
        queryGiphy(chosenTopic);
    });

$(document).ready(function () {

    $("#add-topic").on("click", function (event) {

        event.preventDefault();

        const newTopic = $("#topic-input").val();
        if (newTopic === "") {
        } else {
            topics.push(newTopic);
            $("#topic-input").val("");
        }
        renderButtons();
    });

    renderButtons();

});

// Saves your favorite gifs to local storage and reloads them.

let favArray = JSON.parse(localStorage.getItem("FavoriteGifs"));

if (!Array.isArray(favArray)) {
    favArray = [];
}

renderFavorites(favArray);

