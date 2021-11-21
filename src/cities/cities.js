import PubSub from 'pubsub-js';
import EVENT_TYPES from '../eventTypes';
import helperFuncs from '../helperFuncs';
import citiesData from './data.json';

const cities = () => {
  const citiesCollection = citiesData;

  const find = (cityName) => {
    const cityRegex = new RegExp(cityName);
    const matchedCities = citiesCollection.filter((city) =>
      cityRegex.test(city.name)
    );
    return matchedCities;
  };

  const findCities = ({ name }) => {
    const matchedCities = find(name);
    PubSub.publish(EVENT_TYPES.cities, { cities: matchedCities });
  };

  const random = () => helperFuncs.randomElement(citiesCollection);

  const getRandomCityName = () => {
    const randomCityName = random().name;
    PubSub.publish(EVENT_TYPES.cities, { name: randomCityName });
  };

  PubSub.subscribe(EVENT_TYPES.find_cities, findCities);
  PubSub.subscribe(EVENT_TYPES.random, getRandomCityName);
};

export default cities;
