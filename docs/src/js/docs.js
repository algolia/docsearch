const sidebar = document.querySelector('.navigation-sidebar');
const open = document.querySelector('.navigation-open');
const close = document.querySelector('.navigation-close');
const body = document.querySelector('body');
const hamburger = document.querySelector('.custom-toggle-nav');

function toggleNav(event) {
  sidebar.classList.toggle('hidden');
  open.classList.toggle('hidden');
  close.classList.toggle('hidden');
  body.classList.toggle('navigation-menu-open');
  event.preventDefault();
}
hamburger.onclick = toggleNav;
