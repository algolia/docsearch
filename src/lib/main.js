import toFactory from 'to-factory';
import DocSearch from './DocSearch';
import version from './version.js';

const docsearch = toFactory(DocSearch);
docsearch.version = version;

export default docsearch;
