// Анимация заголовков

class AnimateTitle {
  constructor({ selectors, delay }) {
    if (Array.isArray(selectors) && selectors.length) {
      this._selectors = selectors;
      this._titleEls = document.querySelectorAll(selectors.join(`,`));
      this.indexOfGroup = 0;
    }

    if (Array.isArray(delay) && delay.length) {
      this._delay = delay;
    }
  }

  async init() {
    if (this._titleEls && this._titleEls.length) {
      for (const [i, title] of this._titleEls.entries()) {
        title.classList.add(`js-animation-title`);

        await this.fillingTitleWrappedLetters(title, i);
        const lines = await this.splitTitleToLine(title);

        this.filingTitleLines(title, lines);
      }
    }
  }

  drawLetter(i, l, index) {
    const template = `<span style="--delay: ${
      (typeof this._delay[i] !== `undefined` ? this._delay[i] : 0.9) +
      (this.indexOfGroup === 1
        ? index + 1
        : this.indexOfGroup === 2
        ? index - 1
        : index) /
        10
    }s;">${l}</span>`;

    if (this.indexOfGroup < 2) {
      if (l !== ` `) {
        this.indexOfGroup++;
      }
    } else {
      this.indexOfGroup = 0;
    }

    return template;
  }

  async fillingTitleWrappedLetters(title, i) {
    // Разделение на слова
    const lettersHTML = title.innerHTML
      .trim()
      .split(``)
      .filter((l) => l !== ``)
      .map((l, index) => this.drawLetter(i, l, index))
      .join(``);

    // Заполнение буквами
    title.innerHTML = lettersHTML;
  }

  async splitTitleToLine(title) {
    // Разбиение на строки
    const letterEls = title.querySelectorAll(`:scope > span`);

    const lines = [];
    let letterOffsetTop;
    let i = 0;
    letterEls.forEach((letterEl) => {
      if (typeof letterOffsetTop === `undefined`) {
        letterOffsetTop = letterEl.offsetTop;

        lines[i] = [letterEl.outerHTML];
      } else if (letterOffsetTop === letterEl.offsetTop) {
        lines[i].push(letterEl.outerHTML);
      } else if (letterOffsetTop !== letterEl.offsetTop) {
        letterOffsetTop = letterEl.offsetTop;
        i++;

        lines[i] = [letterEl.outerHTML];
      }
    });

    return lines;
  }

  filingTitleLines(title, lines) {
    // Заполнение строками
    title.innerHTML = lines
      .map(
        (line) =>
          `<span class="js-animation-title-line">${line.join(``)}</span>`
      )
      .join(``);
  }
}

const animateTitles = new AnimateTitle({
  selectors: [
    `.intro__title`,
    `.intro__date`,
    `.slider__item-title`,
    `.prizes__title`,
    `.rules__title`,
    `.game__title`,
  ],
  delay: [0.9, 3, 0, 0.3, 0.3, 0],
});

// Анимация SVG

class AnimateSVG {
  constructor(selector) {
    if (selector) {
      this._el = document.querySelector(selector);
      this._isStarted = false;

      this.onUrlHashChangedHandler = this.onStartAnimation.bind(this);
    }
  }

  init() {
    this.onStartAnimation();

    window.addEventListener(`popstate`, this.onUrlHashChangedHandler);

    document.body.addEventListener(
      `screenChanged`,
      this.onUrlHashChangedHandler
    );
  }

  onStartAnimation(evt) {
    if (
      ((evt instanceof PopStateEvent &&
        evt.target.location.hash === `#prizes`) ||
        window.location.hash === `#prizes` ||
        (evt && evt.detail && evt.detail.screenName === `prizes`)) &&
      this._el
    ) {
      this._el.beginElement();
    }
  }
}

const prizesAnimate = new AnimateSVG(`#primaryAwardFromShow`);

// Инициализация анимаций
export default () => {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);

  if (!mediaQuery.matches) {
    animateTitles.init();
    prizesAnimate.init();
  }

  mediaQuery.addEventListener(`change`, () => {
    window.location.reload();
  });
};
