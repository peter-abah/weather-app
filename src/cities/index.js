import PubSub from 'pubsub-js';
import EVENT_TYPES from '../eventTypes';
import { randomElement } from '../helperFuncs';
import citiesData from './data.json';

const cities = (() => {
  const cityNames = citiesData;

  const find = (cityName) => {
    const cityRegex = new RegExp(cityName, 'i');
    const matchedCities = cityNames.filter((city) =>
      cityRegex.test(city)
    );
    return matchedCities;
  };

  const findCities = (_, { name }) => {
    let matchedCities = find(name);
    matchedCities = matchedCities.sort();
    PubSub.publish(EVENT_TYPES.cities, { cities: matchedCities });
  };

  const random = () => randomElement(cityNames);

  const getRandomCityName = () => {
    const randomCityName = random().name;
    PubSub.publish(EVENT_TYPES.city, { name: randomCityName });
  };

  PubSub.subscribe(EVENT_TYPES.find_cities, findCities);
  PubSub.subscribe(EVENT_TYPES.random, getRandomCityName);
})();

export default cities;
