const oneRandom = "https://dog.ceo/api/breeds/image/random";
const breedList = "https://dog.ceo/api/breeds/list/all";
let oneImage, breedButton, ratingBox, rating;
const ratings = [10, 11, 12, 13, 14, 15, 16];

function getOne(url) {
  fetch(url, {
    method: "get",
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      oneImage = d3.select("#pics");

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
          "uk-button uk-button-default uk-margin-small uk-margin-right"
        )
        .html(d => d)
        .on("click", d => {
          d3.event.preventDefault();
          console.log(d);
          rating = d;
          d3.select("#display-rating").remove();
          oneImage
            .append("h3")
            .attr("class", "uk-margin uk-margin-right")
            .attr("id", "display-rating")
            .text(() => (rating ? `Rating: ${rating}` : "No rating"))
            .append("button")
            .attr(
              "class",
              "uk-button uk-button-primary uk-margin uk-margin-left"
            )
            .text("Save Doggie");
        });

      oneImage
        .append("button")
        .attr("id", "breed-button")
        .attr("class", "uk-button uk-margin-top uk-button-default")
        .text("Get another random image")
        .on("click", () => {
          d3.selectAll("h3").remove();
          d3.selectAll("img").remove();
          d3.selectAll("button").remove();
          d3.selectAll("form").remove();
          getOne(url);
        });
    })
    .catch(err => console.log("failed to load one random image.", err));
}

fetch(breedList)
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res.message);
  })
  .catch(err => console.log(`Breed list failed!`, err));

getOne(oneRandom);
