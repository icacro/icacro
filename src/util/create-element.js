const reservedElements = ['div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];
const className = 'adiv namenofclass kalle';

function create(classes) {
  const arr = classes.split(' ');
  const findType = arr.find(name => reservedElements.find(element => element === name));
  const type = findType || 'div';
  console.log(type);
}

console.clear();

create(className);
