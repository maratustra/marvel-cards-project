/*jshint esversion: 6 */

const contentElement = document.querySelector('.content');
const detailsElement = document.querySelector('.details');
const movieSelector = document.querySelector('#movie');
const genderSelector = document.querySelector('#gender');
const statusSelector = document.querySelector('#status');
const resetBtn = document.querySelector('#reset-filters');
let heroesList;

class Hero {
  constructor({ name = 'unknown', realName = 'unknown', species = 'unknown', citizenship = 'unknown', gender = 'unknown', birthDay = 'unknown', deathDay = '-', status = 'unknown', actors = 'unknown', photo = 'unknown', movies = [] } = {}) {
    this.name = name;
    this.realName = realName;
    this.species = species;
    this.citizenship = citizenship;
    this.gender = gender;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.status = status;
    this.actors = actors;
    this.photo = photo;
    this.movies = movies;
  }
}

class Heroes {
  constructor() {
    this.allHeroesList = [];
    this.filteredHeroesList = [];
    this.filters = new Map();
    this.listOfHeroMovies = new Set();
  }

  putHero(hero) {
    this.allHeroesList.push(hero);

    hero.movies.forEach(movie => this.listOfHeroMovies.add(movie));

    this.filterHeroes();
    return this;
  }

  findHeroByName(heroId) {
    return this.allHeroesList.find(hero => hero.name === heroId);
  }

  clearAllFilters() {
    this.filters.clear();
    this.filterHeroes();
    return this;
  }

  filterByMovie(movieName) {
    this.filters.set('byMovie', movieName);
    this.filterHeroes();
    return this;
  }

  clearMoviesFilter() {
    this.filters.delete('byMovie');
    this.filterHeroes();
    return this;
  }

  filterByGender(gender) {
    this.filters.set('byGender', gender);
    this.filterHeroes();
    return this;
  }

  clearGenderFilter() {
    this.filters.delete('byGender');
    this.filterHeroes();
    return this;
  }

  filterByStatus(status) {
    this.filters.set('byStatus', status);
    this.filterHeroes();
    return this;
  }

  clearStatusFilter() {
    this.filters.delete('byStatus');
    this.filterHeroes();
    return this;
  }


  filterHeroes() {
    this.filteredHeroesList = [...this.allHeroesList];

    for (let [filterName, filterValue] of this.filters) {

      switch (filterName) {
        case 'byMovie':
          this.filteredHeroesList = this.filteredHeroesList.filter(hero => hero.movies.includes(filterValue));
          break;

        case 'byGender':
          this.filteredHeroesList = this.filteredHeroesList.filter(hero => hero.gender === filterValue);
          break;

        case 'byStatus':
          this.filteredHeroesList = this.filteredHeroesList.filter(hero => hero.status === filterValue);
          break;
      }
    }
  }
}

class HeroUI {
  static buildHeroSummaryElement(hero) {
    const heroSummaryElement = document.createElement('div');
    heroSummaryElement.classList.add('marvel-hero');
    heroSummaryElement.dataset.name = `${hero.name}`;

    heroSummaryElement.innerHTML = HeroUI.heroSummaryTemplate(hero);

    return heroSummaryElement;
  }

  static heroSummaryTemplate(hero) {
    return `
     <div class="img-container">
        <img class="round" src="${hero.photo}" alt="hero" />
      </div>
      <div class="info">
        <h3 class="name">${hero.name}</h3>
      </div > 
      `;
  }

  static buildHeroFullInfoElement(hero) {
    const heroFullInfoElement = document.createElement('div');
    heroFullInfoElement.classList.add('hero-details-container');

    heroFullInfoElement.innerHTML = HeroUI.heroFullInfoCardTemplate(hero);

    heroFullInfoElement.addEventListener('click', (e) => {
      if (e.target.closest('.close-hero-details')) {
        HeroUI.hideHeroDetails();
      }

      if (e.target.closest('.status')) {
        heroesList.filterByStatus(e.target.textContent);
        HeroUI.show(heroesList);
        HeroUI.hideHeroDetails();
      }

      if (e.target.closest('.gender')) {
        heroesList.filterByGender(e.target.textContent.slice(8));
        HeroUI.show(heroesList);
        HeroUI.hideHeroDetails();
      }

      if (e.target.closest('.hero-movie')) {
        heroesList.filterByMovie(e.target.textContent);
        HeroUI.show(heroesList);
        HeroUI.hideHeroDetails();
      }
    });

    return heroFullInfoElement;
  }

  static heroFullInfoCardTemplate(hero) {
    return `
    <button class="close-hero-details"></button>
    <span class="status">${hero.status}</span >
    <div class="hero-image">
      <img class="round" src="${hero.photo}" alt="hero" />
    </div>
    <div class="hero-data">
      <h2>"${hero.name}"</h2>
      <h5>real Name: ${hero.realName}</h5>
      <p>actor: ${hero.actors}</p>
      <div class="cardInfo">
        <ul>
          <li><b>species:</b> ${hero.species}</li>
          <li><b>citizenship:</b> ${hero.citizenship}</li>
          <li class="gender"><b>gender:</b> <span class="link">${hero.gender}</span></li>
          <li><b>born:</b> ${hero.birthDay}</li>
          <li><b>died:</b> ${hero.deathDay}</li>
        </ul>
      </div>
      <div class="movies">
        <h5>Movies <span>(click to show all heroes from the movie)</span></h5>
        <ul class="hero-movie">
          ${hero.movies.map(movie => `<li>${movie}</li>`).join('')}
        </ul>
      </div>
    </div>
    `;
  }

  static buildHeroesList(heroes = new Heroes()) {
    const heroesListMainContainer = document.createElement('div');
    heroesListMainContainer.classList.add('heroes-main-container');

    const heroesShownNumber = document.createElement('div');
    heroesShownNumber.classList.add('heroes-shown-number');
    heroesShownNumber.innerHTML = `heroes amount: ${heroes.filteredHeroesList.length}`;
    heroesListMainContainer.append(heroesShownNumber);

    const heroesListContainer = document.createElement('div');
    heroesListContainer.classList.add('heroes-container');
    heroesListMainContainer.append(heroesListContainer);

    heroesListContainer.addEventListener('click', (e) => {
      const heroElement = e.target.closest('.marvel-hero');

      if (heroElement) {
        let hero = heroes.findHeroByName(heroElement.dataset.name);
        HeroUI.showHeroDetails(hero);
      }
    });

    heroes.filteredHeroesList.forEach(hero => {
      hero = HeroUI.buildHeroSummaryElement(hero);
      heroesListContainer.append(hero);
    });

    return heroesListMainContainer;
  }


  static createMoviesOptions(heroes = new Heroes()) {
    let sortedListHeroMovies = Array.from(heroes.listOfHeroMovies).sort();

    sortedListHeroMovies.forEach(movieName => {
      let selectMovieOption = document.createElement('option');
      selectMovieOption.textContent = movieName;

      movieSelector.append(selectMovieOption);
    });
  }

  static show(heroes) {
    contentElement.innerHTML = '';

    const heroesListContainer = HeroUI.buildHeroesList(heroes);
    contentElement.append(heroesListContainer);

    HeroUI.createMoviesOptions(heroes);
  }

  static showHeroDetails(hero) {
    const heroFullInfoElement = HeroUI.buildHeroFullInfoElement(hero);
    detailsElement.append(heroFullInfoElement);
    detailsElement.classList.toggle('active');
  }

  static hideHeroDetails() {
    detailsElement.classList.toggle('active');
    detailsElement.innerHTML = '';
  }
}


const createHeroesListFromRawHeroesData = (rawHeroesData) => {
  const heroes = new Heroes();

  rawHeroesData.forEach(rawHero => {
    const hero = new Hero(rawHero);
    heroes.putHero(hero);
  });

  // ???????????????????? ????????????, ?????????? ???????????????????????? ?????? ?? ?????????????????? .then
  return new Promise((resolve, reject) => resolve(heroes));
};

const fetchHeroesData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
};


movieSelector.addEventListener('change', (e) => {

  if (e.target.value === '') heroesList.clearMoviesFilter();
  else heroesList.filterByMovie(e.target.value);

  HeroUI.show(heroesList);
});

genderSelector.addEventListener('change', (e) => {

  if (e.target.value === '') heroesList.clearGenderFilter();
  else heroesList.filterByGender(e.target.value);

  HeroUI.show(heroesList);
});

statusSelector.addEventListener('change', (e) => {

  if (e.target.value === '') heroesList.clearStatusFilter();
  else heroesList.filterByStatus(e.target.value);

  HeroUI.show(heroesList);
});

resetBtn.addEventListener('click', (e) => {
  heroesList.clearAllFilters();
  statusSelector.value = '';
  genderSelector.value = '';
  movieSelector.value = '';

  HeroUI.show(heroesList);
});


fetchHeroesData('dbHeroes.json')
  .then(rawHeroesData => createHeroesListFromRawHeroesData(rawHeroesData))
  .then(heroes => {
    heroesList = heroes;
    HeroUI.show(heroes);
  });
