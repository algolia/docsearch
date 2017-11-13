let data = {};
const merge = require('deepmerge');
let assets = require('./../../build/assets');

try {
  data = require('./communityHeader.data.json');
} catch (e) {
  data = require('./communityHeader.example.json');
}

/**
 * Render item template
 * @param  {[type]} t [template item]
 * @return {[String]} [rendered template]
 */
const renderDropdownItem = (done, t, assets) => {
  const isSvgTile = assets[t.logo] ? assets[t.logo] : false;
  return done += `
  <li>
    <div class="dropdown-item">
      <a href="${t.url || "#"}" ${t.target ? `target=${t.target}`: ""}>
        ${isSvgTile ? `<span class="item-icon" style="background: ${t.backgroundColor}">${isSvgTile}</svg></span>` : `<span class="item-icon" style="background: ${t.backgroundColor}"><img src="${t.logo || ""}" alt="${t.name || ""}"/></span>`}
        <h4>${t.name}</h4>
      </a>
    </div>
  </li>`;
}

const renderDropdownList = (data, assets) => {

  let entireList = "";

  Object.keys(data).forEach(list => {
    const listItem = data[list];
    const listArray = listItem.dropdownItems;
    let listString = `
    <div class="algc-dropdownroot__section">
      <div class="algc-dropdownroot__content" data-dropdown-content="${listItem.view.toLowerCase()}">
      <ul class="algc-dropdownroot__${listItem.style || 'widelist'}">`;

    listString += listArray.reduce((prev, next, i) => renderDropdownItem(prev, next, assets), "");
    listString +=
      `</ul>
        <div class="algc-dropdownroot__footer">
          <a href="https://discourse.algolia.com/?utm_medium=social-owned&utm_source=communityHeader">
            <span style="font-weight:bold;">Community Forum</span>
          </a>
        </div>
        </div>
        </div>`;

    entireList += listString;
  });
  return entireList;
}

const renderMenu = ({ label, type, dropdownItems, logo, view, url, target }) => {
    const link = (!dropdownItems || dropdownItems.length === 0) ? "#" : url
    return `
    <li class="algc-navigation__li">
      <a class='algc-badge algc-navigation__navitem' href='${url} ${target ? `target=${target}`: ""}'
       data-dropdown="${ view.toLowerCase() }" data-enabledropdown="${ dropdownItems.length > 0 }">
            <svg class="algc-arrowseparator" viewBox="0 0 18 35" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" fill="none" fill-rule="evenodd"><g id="community/header" fill="#3369E6"><g id="Group-13"><g id="Group-2"><path id="Combined-Shape-Copy" d="M1.8537 34.7643l15.5597-17.268L1.8537 0H0l15.5597 17.4964L0 34.7644z"/></g></g></g></g></svg>
            ${logo !== "" ? logo : ""}
            ${label ? `<span>${ label }</span>`: ""}
      </a>
    </li>`
}

const renderMenuList = (data) => {
  let entireList = "";
  const listItem = data["project"];
  entireList += renderMenu(listItem);

  return entireList;
}

const renderDocSearch = (docSearch, assets) => {
  if(!docSearch) return ""

  return `
    <div class='algc-menu__search'>
      <div class='algc-menu__search--holder${docSearch.input_open_on_init ? ` open` : ""}'>
        <div class='algc-search__input algc-search__input--docsearch'>
          <input id='${docSearch.input_selector}' placeholder='${docSearch.input_selector_placeholder}' type='search'>
          <button id='search'>
            ${assets['searchIcon']}
          </button>
          <button id='cancel'>
            ${assets['searchCloseIcon']}
          </button>
        </div>
      </div>
    </div>`;
}

const renderRightList = (sideList) => {
  if(!sideList.length) return;
  let markup = "<ul class='algc-menu__list'>"

  markup += sideList.reduce((prev,next) => renderRightListItem(prev,next),"");
  markup += "</ul>"

  return markup;
}

const renderRightListItem = (prev, data) => {
  if(data.image){
    return prev += `
      <li class="algc-menu__list__item ${data.dropdownItems && data.dropdownItems.length ? "algc-menu--hassublist" : ""}">
        <a href="${data.url || "#"}"
          ${data.target ? `target=${data.target}`: ""}
          class="${data.dropdownItems && data.dropdownItems.length ? "algc-menu--sublistlink" : ""}">
          ${data.image}
          ${ renderGlyph(data) }
        </a>
        ${renderSubList(data.dropdownItems)}
      </li>`;
  } else {
    return prev += `
      <li class="algc-menu__list__item ${data.dropdownItems && data.dropdownItems.length ? "algc-menu--hassublist" : ""}">
        <a href="${data.url || "#"}" ${data.target ? `target=${data.target}`: ""} class="${data.dropdownItems && data.dropdownItems.length ? "algc-menu--sublistlink" : ""}">
          ${data.name}
          ${ renderGlyph(data) }
        </a>
        ${renderSubList(data.dropdownItems)}
      </li>`
  }
}

const renderGlyph = (data) => {
  if(data.dropdownItems && data.dropdownItems.length){
    return '<span class="algc-glyph">▼</span>'
  } else {
    return "";
  }
}

const renderSubList = (subList) => {
  if(!subList || !subList.length) return "";
  let markup = "<ul class='algc-menu__sublist'>";
  markup += subList.reduce((prev,next) => renderSubListItem(prev,next),"");
  markup += "</ul>";

  return markup;
}

const renderSubListItem = (prev, data) => {
  return prev += `
    <li>
      <a href="${data.url || "#"}" ${data.target ? `target=${data.target}`: ""}>${data.name}</a>
    </li>
  `
}

const renderMobileMenu = (sideList) => {
  if(!sideList.length) return;
  let markup = "<div class='algc-mobilemenu'><div class='algc-mobilemenuwrapper'><ul class='algc-mobilemenulist'>"
  markup += sideList.reduce((prev,next) => renderMobileMenuItem(prev,next),"");
  markup += "</ul></div></div>"
  return markup;
}

const renderMobileMenuItem = (prev, data) => {
  if(data.image){
     return prev += `
      <li class="algc-mobilemenu__item">
        <a href="${data.url || "#"}" ${data.target ? `target=${data.target}`: ""}>
          ${data.image}
          ${data.name ? data.name : ""}
        </a>
      </li>`;
  } else {
    return prev += `
      <li class="algc-mobilemenu__item">
        <a href="${data.url || "#"}" ${data.target ? `target=${data.target}`: ""}>
          ${data.name}
        </a>
      </li>`
  }
}

module.exports = function(paramData = {}, assetParams = {}){
  const d = merge(data, paramData);
  const a = merge(assets, assetParams);
  return `<!-- Start community header -->
    <nav class='algc-navigation'>
      <div class='algc-navigation__container'>
        <div class='algc-mainmenu'>
          <ul class='algc-navigation__brands'>
            <li class='algc-navigation__li algc-navigation__li--algolia'>
              <a href='https://www.algolia.com/'>
                ${a['algoliaLogo']}
              </a>
            </li>
            <li class='algc-navigation__li algc-navigation__li--community'>
              <a href='https://community.algolia.com/' data-enabledropdown="true" data-dropdown="integrations">
                <svg class="algc-arrowseparator" viewBox="0 0 18 35" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" fill="none" fill-rule="evenodd"><g id="community/header" fill="#3369E6"><g id="Group-13"><g id="Group-2"><path id="Combined-Shape-Copy" d="M1.8537 34.7643l15.5597-17.268L1.8537 0H0l15.5597 17.4964L0 34.7644z"/></g></g></g></g></svg>
                ${a['communityLogo']}
                ${a['iconSeparator']}
              </a>
            </li>
            ${renderMenuList(d.menu)}
          </ul>

          <div class='algc-navigation__menu'>
            ${renderDocSearch(d.docSearch, a)}
            ${renderRightList(d.sideMenu)}
            <button class='algc-openmobile'><span></span></button>
          </div>
          
          <div class='algc-navigation__dropdown-holder'>
            <div class='algc-dropdownroot notransition'>
              <div class='algc-dropdownroot__dropdownbg'></div>
              <div class='algc-dropdownroot__dropdownarrow'></div>
              <div class='algc-dropdownroot__dropdowncontainer'>
                ${renderDropdownList(d.menu, a)}
              </div>
            </div>
          </div>
        </div>
      </div>

      ${renderMobileMenu(d.mobileMenu)}

    </nav>
    <!-- End community_header --> `;
}
