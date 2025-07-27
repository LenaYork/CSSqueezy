let savedText = {
  squeeze: { input: '', output: '' },
  beautify: { input: '', output: '' }
};

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

  const copyBtn = document.getElementById('copy-btn');
  const activeTab = document.querySelector('.tab-content:not(.hidden)');
  const hasOutput = activeTab.id === 'squeeze-tab' ? !!squeezeOutput : !!beautifyOutput;
  
  copyBtn.disabled = !hasOutput;
  copyBtn.title = hasOutput ? "Copy to clipboard" : "Nothing to copy";

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

    updateButtons();
  });
});

document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', updateButtons);
});

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
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

document.getElementById('copy-btn').addEventListener('click', () => {
  const activeTab = document.querySelector('.tab-content:not(.hidden)');
  const output = activeTab.querySelector('textarea[readonly]');
  output.select();
  document.execCommand('copy');
  
  const copyBtn = document.getElementById('copy-btn');
  const originalHTML = copyBtn.innerHTML;
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
    Copied!
  `;
  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  updateButtons();
});