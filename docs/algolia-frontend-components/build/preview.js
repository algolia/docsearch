
import base from './../stylesheets/_base.scss';
import css from './../components/communityHeader/communityHeader.scss';
import communityHeader from './../components/communityHeader/communityHeader';

window.addEventListener('load', () => {
  var header = new communityHeader({
    apiKey: '52641df1ce4919ba42eb84595f4825c7',
    indexName: 'wordpress_algolia',
    inputSelector: '#searchbox'
  });
});