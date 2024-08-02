export default () => {
  window.addEventListener(`load`, () => {
    const body = document.body || document.querySelector(`body`);

    if (body) {
      body.classList.add(`load`);
    }
  });
};
