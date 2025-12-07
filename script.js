let savedText = {
  squeeze: { input: '', output: '' },
  beautify: { input: '', output: '' }
};

let preserveComments = false; // по умолчанию комментарии удаляются

function saveToStorage() {
  localStorage.setItem('css_data', JSON.stringify({
    inputSqueeze: document.getElementById('input-squeeze').value,
    outputSqueeze: document.getElementById('output-squeeze').value,
    inputBeautify: document.getElementById('input-beautify').value,
    outputBeautify: document.getElementById('output-beautify').value,
    activeTab: document.querySelector('.tab-btn.active').dataset.tab
  }));
}

function loadFromStorage() {
  const saved = JSON.parse(localStorage.getItem('css_data'));
  if (!saved) return;

  document.getElementById('input-squeeze').value = saved.inputSqueeze || '';
  document.getElementById('output-squeeze').value = saved.outputSqueeze || '';
  document.getElementById('input-beautify').value = saved.inputBeautify || '';
  document.getElementById('output-beautify').value = saved.outputBeautify || '';

  savedText.squeeze.input = saved.inputSqueeze || '';
  savedText.squeeze.output = saved.outputSqueeze || '';
  savedText.beautify.input = saved.inputBeautify || '';
  savedText.beautify.output = saved.outputBeautify || '';

  if (saved.activeTab === 'beautify') {
    document.querySelector('.tab-btn[data-tab="beautify"]').click();
  }
}

function toggleComments() {
  preserveComments = !preserveComments;
  updateCommentsButton();

  // // Показываем уведомление
  // showNotification(
  //   preserveComments ?
  //     '' :
  //     ''
  // );
}

function updateCommentsButton() {
  const btn = document.getElementById('toggleComments');
  if (!btn) return;

  const isActive = preserveComments;
  btn.classList.toggle('active', isActive);

  btn.setAttribute('data-tooltip', isActive ? 
    'Отключить сохранение комментов' : 
    'Включить сохранение комментов');

  // Меняем иконку
  const svg = btn.querySelector('svg');
  if (svg) {
    if (isActive) {
      // Активно - зеленый пузырь без перечеркивания
      svg.innerHTML = '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#00b894"/>';
    } else {
      // Неактивно - серый пузырь с красной перечеркивающей линией
      svg.innerHTML = '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#95a5a6"/><path d="M1 1l22 22" stroke="#ff4444" stroke-width="3" fill="none"/>';
    }
  }
}

// function showNotification(message) {
//   // Простое уведомление в консоль для начала
//   console.log(message);
// }

const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function updateButtons() {
  const squeezeInput = document.getElementById('input-squeeze').value.trim();
  const beautifyInput = document.getElementById('input-beautify').value.trim();
  const squeezeOutput = document.getElementById('output-squeeze').value.trim();
  const beautifyOutput = document.getElementById('output-beautify').value.trim();

  const squeezeBtn = document.getElementById('squeeze-btn');
  const beautifyBtn = document.getElementById('beautify-btn');

  squeezeBtn.disabled = !squeezeInput;
  beautifyBtn.disabled = !beautifyInput;

  squeezeBtn.title = squeezeInput ? "Minify CSS code" : "Input field is empty";
  beautifyBtn.title = beautifyInput ? "Format CSS code" : "Input field is empty";

  // Обновляем кнопки Copy отдельно для каждой вкладки
  const copySqueezeBtn = document.getElementById('copy-squeeze');
  const copyBeautifyBtn = document.getElementById('copy-beautify');

  copySqueezeBtn.disabled = !squeezeOutput;
  copyBeautifyBtn.disabled = !beautifyOutput;

  copySqueezeBtn.title = squeezeOutput ? "Copy to clipboard" : "Nothing to copy";
  copyBeautifyBtn.title = beautifyOutput ? "Copy to clipboard" : "Nothing to copy";

  saveToStorage();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab-content:not(.hidden)');
    if (activeTab.id === 'squeeze-tab') {
      savedText.squeeze.input = document.getElementById('input-squeeze').value;
      savedText.squeeze.output = document.getElementById('output-squeeze').value;
    } else {
      savedText.beautify.input = document.getElementById('input-beautify').value;
      savedText.beautify.output = document.getElementById('output-beautify').value;
    }

    saveToStorage();
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(content => content.classList.add('hidden'));
    const tabId = tab.getAttribute('data-tab') + '-tab';
    document.getElementById(tabId).classList.remove('hidden');

    if (tabId === 'squeeze-tab') {
      document.getElementById('input-squeeze').value = savedText.squeeze.input;
      document.getElementById('output-squeeze').value = savedText.squeeze.output;
    } else {
      document.getElementById('input-beautify').value = savedText.beautify.input;
      document.getElementById('output-beautify').value = savedText.beautify.output;
    }

    // Управляем кнопкой комментариев
    const commentsBtn = document.getElementById('toggleComments');
    if (tabId === 'squeeze-tab') {
      commentsBtn.disabled = false;
      commentsBtn.setAttribute('data-tooltip', preserveComments ? 
      'Тыкни чтобы отключить сохранение комментов' : 
      'Тыкни чтобы включить сохранение комментов');
      // commentsBtn.title = preserveComments ? 'Комментарии сохраняются' : 'Комментарии удаляются';
      commentsBtn.style.opacity = '1';
      commentsBtn.style.cursor = 'pointer';
    } else {
      commentsBtn.disabled = true;
      // commentsBtn.title = 'Недоступно для Beautify';
      commentsBtn.setAttribute('data-tooltip', 'Недоступно для Beautify');

      commentsBtn.style.opacity = '0.5';
      commentsBtn.style.cursor = 'not-allowed';
    }

    updateButtons();
  });
});

document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', updateButtons);
});

function minifyCSS(css) {
  let processedCSS = css;

  // Удаляем комментарии только если preserveComments = false
  if (!preserveComments) {
    processedCSS = processedCSS.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
  }

  // Остальная логика минификации без изменений
  return processedCSS
    .replace(/\s+/g, ' ')
    .replace(/\s?([{}:;,])\s?/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function beautifyCSS(css) {
  return cssbeautify(css, {
    indent: '  ',
    openbrace: 'end-of-line',
    autosemicolon: true
  });
}

document.getElementById('squeeze-btn').addEventListener('click', () => {
  const input = document.getElementById('input-squeeze').value;
  const output = minifyCSS(input);
  document.getElementById('output-squeeze').value = output;
  savedText.squeeze.output = output;
  updateButtons();
});

document.getElementById('beautify-btn').addEventListener('click', () => {
  const input = document.getElementById('input-beautify').value;
  const output = beautifyCSS(input);
  document.getElementById('output-beautify').value = output;
  savedText.beautify.output = output;
  updateButtons();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();

    const activeTab = document.querySelector('.tab-content:not(.hidden)');
    if (activeTab.id === 'squeeze-tab') {
      const input = document.getElementById('input-squeeze').value.trim();
      if (input) document.getElementById('squeeze-btn').click();
    }
    else if (activeTab.id === 'beautify-tab') {
      const input = document.getElementById('input-beautify').value.trim();
      if (input) document.getElementById('beautify-btn').click();
    }
  }
});

// Добавляем обработчик для кнопки комментариев
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  updateButtons();

  // Инициализируем кнопку комментариев
  const commentsBtn = document.getElementById('toggleComments');
  if (commentsBtn) {
    commentsBtn.addEventListener('click', toggleComments);
    updateCommentsButton(); // устанавливаем начальное состояние
  }
});

// Обработчик для кнопки Copy в squeeze табе
document.getElementById('copy-squeeze').addEventListener('click', () => {
  const output = document.getElementById('output-squeeze');
  output.select();
  document.execCommand('copy');

  const copyBtn = document.getElementById('copy-squeeze');
  const originalHTML = copyBtn.innerHTML;
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
    Copied!
  `;
  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
  }, 2000);
});

// Обработчик для кнопки Copy в beautify табе
document.getElementById('copy-beautify').addEventListener('click', () => {
  const output = document.getElementById('output-beautify');
  output.select();
  document.execCommand('copy');

  const copyBtn = document.getElementById('copy-beautify');
  const originalHTML = copyBtn.innerHTML;
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
    Copied!
  `;
  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
  }, 2000);
});