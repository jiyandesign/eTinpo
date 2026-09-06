(() => {
  const letterOffsets = [-7, 27, -13, 50, -38, 5, -42, 8, 0, 35];
  const addLetterMotion = (letter, index) => {
    letter.classList.add('rdBnLetter');
    letter.style.setProperty('--rd-letter-y', `${letterOffsets[index % letterOffsets.length]}px`);
  };

  document.querySelectorAll('[data-rd-split-labels] .rdBnLabel').forEach((label, rowIndex) => {
    const text = label.textContent.trim().toUpperCase();
    const fragment = document.createDocumentFragment();
    let letterIndex = 0;

    label.textContent = '';

    Array.from(text).forEach((character) => {
      const part = document.createElement('span');

      if (character === ' ') {
        part.className = 'rdBnSpace';
        part.textContent = '\u00a0';
      } else {
        addLetterMotion(part, letterIndex + rowIndex);
        part.textContent = character;
        letterIndex += 1;
      }

      fragment.appendChild(part);
    });

    label.appendChild(fragment);
  });

})();
