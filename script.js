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
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabContents.forEach(content => {
      content.classList.add('hidden');
    });

    tabs.forEach(t => {
      t.classList.remove('active');
    });

    const tabId = tab.getAttribute('data-tab') + '-tab';
    document.getElementById(tabId).classList.remove('hidden');

    tab.classList.add('active');
  });

  updateButtons()
});

document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', updateButtons);
});

document.addEventListener('DOMContentLoaded', () => {
  updateButtons();
});