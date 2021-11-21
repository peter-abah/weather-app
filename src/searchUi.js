import PubSub from 'pubsub-js';
import EVENT_TYPES from './eventTypes';

const searchUi = () => {
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

  const findCities = (event) => {
    event.preventDefault();

    const query = event.target.value;
    PubSub.publish(EVENT_TYPES.find_cities, { name: query });
  };

  const addEventListeners = () => {
    dom.toggleSearchBtns.forEach((btn) => {
      btn.addEventListener('click', toggleSearchWrapperVisibility);
    });
    dom.searchForm.addEventListener('submit', findCities);
  };

  addEventListeners();
};

export default searchUi;
