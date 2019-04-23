const oneRandom = "https://dog.ceo/api/breeds/image/random";
const breedList = "https://dog.ceo/api/breeds/list/all";
const randomByBreed = breed =>
  `https://dog.ceo/api/breed/${breed}/images/random`;
let oneImage, breedButton, ratingBox, rating, favPic;
const ratings = [10, 11, 12, 13, 14, 15, 16];
const favs = [];
let breeds;

function getOne(url) {
  let localFavs = JSON.parse(localStorage.getItem("favorites"));

  fetch(url, {
    method: "get",
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      oneImage = d3
        .select("#pics")
        .append("div")
        .attr("class", "random-image");

      oneImage
        .insert("img")
        .attr("class", "uk-img uk-width-auto uk-align-center")
        .attr("src", res.message);

      ratingBox = oneImage
        .append("form")
        .attr("class", "uk-form")
        .append("div")
        .attr("class", "uk-form-row");

      ratingBox
        .append("legend")
        .attr("class", "uk-legend")
        .text("Rate Me");

      ratingBox
        .selectAll("button")
        .data(ratings)
        .enter()
        .append("button")
        .attr(
          "class",
          "uk-button uk-button-default uk-margin-small uk-margin-right uk-border-rounded"
        )
        .html(d => d)
        .on("click", d => {
          d3.event.preventDefault();

          rating = d;
          d3.select("#display-rating").remove();
          ratingBox
            .append("h3")
            .attr("class", "uk-margin uk-margin-right")
            .attr("id", "display-rating")
            .text(() => (rating ? `Rating: ${rating}` : "No rating"))
            .append("button")
            .attr(
              "class",
              "uk-button uk-button-primary uk-margin uk-margin-left"
            )
            .text("Save Doggie")
            .on("click", d => {
              d3.event.preventDefault();

              const newFav = {
                rating: rating,
                url: res.message
              };
              favs.push(newFav);
              localFavs = [...localFavs, ...favs];
              localStorage.setItem("favorites", JSON.stringify(localFavs));
              d3.selectAll(".random-image").remove();
              getFavs(localFavs);
              getOne(oneRandom);
            });
        });

      oneImage
        .append("button")
        .attr("id", "refresh-button")
        .attr(
          "class",
          "uk-button uk-margin uk-button-primary uk-border-rounded"
        )
        .text("Get another random image")
        .on("click", () => {
          d3.selectAll(".random-image").remove();
          getFavs(localFavs);
          getOne(oneRandom);
        });

      oneImage
        .append("div")
        .selectAll("button")
        .data(buildBreedList(breeds))
        .enter()
        .append("button")
        .attr(
          "class",
          "uk-button-default uk-button-mini uk-margin-small uk-margin-small-right"
        )
        .text(d => `random ${d}`)
        .on("click", d => {
          d3.event.preventDefault();

          const clean = d.trim().includes(" ")
            ? `${d.substring(d.search(" ") + 1)}/${d.substring(
                0,
                d.search(" ")
              )}`
            : d;

          d3.selectAll(".random-image").remove();
          getFavs(JSON.parse(localStorage.getItem("favorites")));
          getOne(randomByBreed(clean));
        });
    })
    .catch(err => console.log("failed to load one random image.", err));
}

function getFavs(myFavs) {
  const favs = d3.select("#favs");

  favPic = favs
    .selectAll(".fav-pics")
    .data(myFavs)
    .enter()
    .append("div")
    .attr(
      "class",
      "fav-pics uk-margin uk-margin-right uk-display-inline-block "
    )
    .insert("h3")
    .text(d => `Rating: ${d.rating}`)
    .insert("img")
    .attr("height", 200)
    .attr("width", 200)
    .attr("class", "dog-image uk-border-rounded uk-padding-small")
    .attr("src", d => d.url)
    .on("click", function() {
      d3.select(this).classed(
        "uk-width-auto",
        this.classList.contains("uk-width-auto") ? "" : "uk-width-auto"
      );
    });
}

function getBreeds(url) {
  fetch(url, {
    method: "get",
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      breeds = res.message;
    })
    .catch(err => console.log(`error fetching the breed list:`, err));
}

function buildBreedList(obj) {
  let listOfBreeds = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      if (element.length > 1) {
        const newElement = element.map(item => `${item} ${key}`);
        listOfBreeds = [...listOfBreeds, ...newElement];
      } else {
        if (key.length > 1) {
          listOfBreeds = [...listOfBreeds, key];
        }
      }
    }
  }
  return listOfBreeds;
}

getOne(oneRandom);
getFavs(JSON.parse(localStorage.getItem("favorites")));
getBreeds(breedList);
