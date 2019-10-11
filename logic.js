const oneRandom = "https://dog.ceo/api/breeds/image/random";
const breedList = "https://dog.ceo/api/breeds/list/all";
const randomByBreed = breed =>
  `https://dog.ceo/api/breed/${breed}/images/random`;
let oneImage,
  breed,
  ratingBox,
  rating = 10,
  favPic;
const ratings = [10, 11, 12, 13, 14, 15, 16];
const favs = [];
let breeds;
let localFavs = JSON.parse(localStorage.getItem("favorites"));

function getOne(url) {
  fetch(url, {
    method: "get",
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      $(".random-image").empty();
      $(".random-image").append(
        `<img src=${res.message} alt='doggie' height='400' width='400' class='uk-img uk-align-center'>`
      );
      favPic = res.message;
    })
    .catch(err => console.log("failed to load one random image.", err));
}

function getFavs(myFavs) {
  $("#favs").empty();
  myFavs &&
    myFavs.map(item => {
      $("#favs").append(
        `<div class='fav-pics uk-margin uk-margin-right uk-display-inline-block'><h3>Rating: ${item.rating}</h3><button class='uk-button remove' value=${item.url}>Remove</button><img src='${item.url}' height='200' width='200' class='dog-image uk-border-rounded uk-padding-small'></div>`
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
      breeds = buildBreedList(res.message);

      breeds.map(item => {
        const dogBreed = item.includes(" ")
          ? item.slice(item.indexOf(" ")).trim()
          : item;

        const subBreed = item.includes(" ")
          ? item.slice(0, item.indexOf(" "))
          : "";

        const dogValue = subBreed ? `${dogBreed}/${subBreed}` : dogBreed;
        $("#breeds-select").append(
          `<option value='${dogValue}'>${item}</option>`
        );
      });
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
  listOfBreeds.unshift("Choose a breed");
  return listOfBreeds;
}

function clearFavoriteHeart() {
  const favoriteActive = $("#favorite").css("color") === "rgb(255, 0, 0)";

  if (favoriteActive) {
    favPic = "";
    $("#favorite").click();
  }
}
// Listeners

$("#rating").on("change", e => {
  rating = e.target.value;
});

$("#favorite").on("click", e => {
  const fill = $("#favorite")
    .find("path")
    .attr("fill");

  if (fill === "none") {
    $("#favorite")
      .find("path")
      .attr("fill", "red");
    $("#favorite").css("color", "red");

    const newFav = {
      rating: rating,
      url: favPic
    };

    if (localFavs) {
      const duplicate = localFavs.filter(item => {
        return item.url === favPic;
      });
      if (duplicate.length < 1) {
        localFavs = [...localFavs, newFav];
      }
    } else {
      localFavs = [newFav];
    }

    localStorage.setItem("favorites", JSON.stringify(localFavs));

    getFavs(localFavs);
  } else {
    $("#favorite")
      .find("path")
      .attr("fill", "none");
    $("#favorite").css("color", "");
    const newFavs = localFavs.filter(item => {
      return item.url !== favPic;
    });
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    localFavs = JSON.parse(localStorage.getItem("favorites"));

    getFavs(newFavs);
  }
});

$("#get-another").on("click", e => {
  e.preventDefault();

  clearFavoriteHeart();
  getOne(oneRandom);
});

$("#breeds-select").on("change", e => {
  breed = e.target.value;
});

$("#get-by-breed").on("click", e => {
  e.preventDefault();
  clearFavoriteHeart();
  if (breed) {
    getOne(randomByBreed(breed));
  } else {
    getOne(oneRandom);
  }
});

$("#favs").on("click", e => {
  e.preventDefault();
  const item = $(e.target);
  if (item.is("button")) {
    const target = item[0].value;
    const newFavs = localFavs.filter(item => {
      return item.url !== target;
    });
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    localFavs = JSON.parse(localStorage.getItem("favorites"));
    clearFavoriteHeart();

    getFavs(newFavs);
  }
});
// Initialization
getOne(oneRandom);
getFavs(JSON.parse(localStorage.getItem("favorites")));

getBreeds(breedList);
