const reservedElements = ['div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];
const className = 'a namenofclass kalle';

function getType(arr) {
  return arr.reduce((acc, current) => {
    const type = reservedElements.find(element => element === current);
    if (type) acc.type = type;
    else if(!type) acc.classes.push(current);
    return acc;
  }, { type: 'div', classes: [] });
}

function create(classes) {
  const arr = classes.split(' ');
  // const [type, classnames] = getType(arr);
  console.log(getType(arr));
}

console.clear();

create(className);
