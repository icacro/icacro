export function hide() {
  if (this.element) {
    Object.assign(this.element.style, {
      display: 'none',
    });
    return this;
  }
  throw new Error(`Element does not exist! Function 'style'`);
}

export function view() {
  if (this.element) {
    Object.assign(this.element.style, {
      display: 'visible',
    });
    return this;
  }
  throw new Error(`Element does not exist! Function 'style'`);
}
