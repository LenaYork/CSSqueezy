const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

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
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.tab-btn').click();
});