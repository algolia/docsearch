function toggleNav() {
  const sidebar = document.getElementsByClassName('navigation-sidebar')[0];
  const open = document.getElementsByClassName('navigation-open')[0];
  const close = document.getElementsByClassName('navigation-close')[0];
  const body = document.getElementsByTagName('body')[0];
  sidebar.classList.toggle('hidden');
  open.classList.toggle('hidden');
  close.classList.toggle('hidden');
  body.classList.toggle('navigation-menu-open');
}
