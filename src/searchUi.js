import PubSub from 'pubsub-js';
import EVENT_TYPES from './eventTypes';
import { clearDomElement } from './helperFuncs';

const searchUi = (() => {
  const splitCityNameRegex = /(.+), (\w{2})/;
  const dom = {
    toggleSearchBtns: [
      document.getElementById('open-search'),
      document.getElementById('close-search'),
    ],
    searchWrapper: document.getElementById('search'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    searchResultsWrapper: document.getElementById('search-results'),
  };

  const toggleSearchWrapperVisibility = () => {
    dom.searchWrapper.classList.toggle('search--hidden');
  };

  const isValidQuery = (event) => {
    if (event.type === 'submit') return true;

    // this is to prevent extremely long results
    return dom.searchInput.value.length >= 3;
  };

  const findCities = (event) => {
    if (!isValidQuery(event)) return;

    const query = dom.searchInput.value;
    if (event.type === 'submit') {
      dom.searchForm.reset();
      event.preventDefault();
    }
    PubSub.publish(EVENT_TYPES.find_cities, { name: query });
  };

  const sendWeatherRequest = (event) => {
    const { city } = event.target.dataset;
    const [_, cityName, country] = city.match(splitCityNameRegex);
    PubSub.publish(EVENT_TYPES.get_weather, { cityName, country });
    toggleSearchWrapperVisibility();
  };

  const createCityBtn = (city) => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.className = 'search__result';
    btn.dataset.city = city;
    btn.addEventListener('click', sendWeatherRequest);
    return btn;
  };

  const createCityBtns = (cities) => {
    const btns = cities.map(createCityBtn);
    return btns;
  };

  const addBtnsTodDom = (btns) => {
    clearDomElement(dom.searchResultsWrapper);
    btns.forEach((btn) => dom.searchResultsWrapper.appendChild(btn));
  };

  const showCities = (_, { cities }) => {
    const btns = createCityBtns(cities);
    addBtnsTodDom(btns);
  };

  const addEventListeners = () => {
    dom.toggleSearchBtns.forEach((btn) => {
      btn.addEventListener('click', toggleSearchWrapperVisibility);
    });
    dom.searchForm.addEventListener('submit', findCities);
    dom.searchForm.addEventListener('input', findCities);
  };

  addEventListeners();
  PubSub.subscribe(EVENT_TYPES.cities, showCities);
})();

export default searchUi;
