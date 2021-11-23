import { format, isTomorrow } from 'date-fns';

const randomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const clearDomElement = (elem) => {
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
};

const convertDateToString = (date) => {
  if (isTomorrow(date)) return 'Tomorrow';

  const dateFormat = 'eee, d LLL'; // => Sun, 17 Jun
  return format(date, dateFormat);
};

export default { randomElement, clearDomElement, convertDateToString };
export { randomElement, clearDomElement, convertDateToString };
