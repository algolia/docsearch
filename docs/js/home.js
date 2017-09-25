function setScreen() {
  const screens = [
    'screen_react',
    'screen_laravel',
    'screen_akka',
    'screen_bootstrap',
    'screen_vue',
    'screen_middleman',
  ];
  const rand = Math.floor(Math.random() * (screens.length - 0) + 0);
  const imgPath = './img/screens/';
  const screenImage = document.createElement('img');
  const imageHolder = document.querySelector('#demo-screens');
  const imagePlaceholder = document.querySelector('#placeholder');

  screenImage.classList.add('demo-screen', 'w100p');
  screenImage.src = imgPath + screens[rand] + '.png';

  imagePlaceholder.remove();
  imageHolder.appendChild(screenImage);
}

window.addEventListener('load', setScreen());
