const randomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const clearDomElement = (elem) => {
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
};

export default { randomElement, clearDomElement };
export { randomElement, clearDomElement };
