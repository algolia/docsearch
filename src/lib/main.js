import toFactory from 'to-factory';
import DocSearch from './DocSearch';
import version from './version.js';

let docSearch = toFactory(DocSearch);
docSearch.version = version;

export default docSearch;
