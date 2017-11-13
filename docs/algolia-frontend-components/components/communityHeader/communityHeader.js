/**
 * Main header function with docsearch
 * @param  {Object} docSearch config
 */

class communityHeader {

  constructor(docSearchCredentials, docSearch) {
    this.docSearchCredentials = docSearchCredentials;
    this.docSearch = docSearch || null;

    this.menuState = {
      isOpen: false,
      isOpenMobile: false
    }

    this.INIT_VAL = {
      WIDTH: 490,
      HEIGHT: 360
    }

    this.disableTransitionTimeout;

    this.searchIcon = document.querySelector('#search');
    this.cancelIcon = document.querySelector('#cancel');
    this.searchInputContainer = document.querySelector('.algc-search__input');
    this.searchContainer = this.searchInputContainer ? this.searchInputContainer.parentNode : null;
    this.navRoot = document.querySelector('.algc-dropdownroot');
    this.dropdownRoot = document.querySelector('.algc-navigation__dropdown-holder');
    this.navItems = document.querySelectorAll('a[data-enabledropdown="true"]');
    this.navContainer = document.querySelector('.algc-dropdownroot__dropdowncontainer');
    this.menuContainer = document.querySelector('.algc-navigation__container');
    this.navBg = document.querySelector('.algc-dropdownroot__dropdownbg');
    this.navArrow = document.querySelector('.algc-dropdownroot__dropdownarrow');
    this.dropDownContainer = document.querySelector('.algc-dropdownroot__dropdowncontainer');
    this.menuTriggers = document.querySelectorAll('[data-enabledropdown="true"]');
    this.mobileMenuButton = document.querySelector('.algc-openmobile ');
    this.mobileMenu = document.querySelector('.algc-mobilemenu');
    this.subList = document.querySelectorAll('.algc-menu--sublistlink');
    this.subListHolders = [...this.subList].map(node => node.parentNode);
    this.menuDropdowns = {};

    [].forEach.call(document.querySelectorAll('[data-dropdown-content]'), (item) => {
      this.menuDropdowns[item.dataset.dropdownContent] = {
        parent: item.parentNode,
        content: item
      }
    });

    this.shouldInitDocSearch = this.shouldInitDocSearch.bind(this);
    this.docSearchInit = this.checkDocSearch(docSearch);
    this.enableDocSearch = this.verifyDocSearchParams(docSearchCredentials);
    this.hasDocSearchRendered = document.querySelector('.algc-navigation .algc-search__input--docsearch');
    this.triggerMenu = this.triggerMenu.bind(this);
    this.shouldTriggerMenu = this.shouldTriggerMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.docSearchToggling = this.docSearchToggling.bind(this);
    this.initDocSearchStrategy = this.initDocSearchStrategy.bind(this);
    this.openSublist = this.openSublist.bind(this);
    this.closeSubLists = this.closeSubLists.bind(this);
    this.bindListeners = this.bindListeners.bind(this);

    this.calculatePosition = this.calculatePosition.bind(this);

    this.verifyDocSearchParams();
    this.shouldInitDocSearch();
    this.initDocSearchStrategy();
    this.bindListeners();
  }

  calculatePosition(sourceNode) {
    const box = sourceNode.getBoundingClientRect();
    const realWidth = sourceNode.offsetWidth;
    const realHeight = sourceNode.offsetHeight;

    return {
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      realWidth: realWidth,
      realHeight: realHeight,
      center: box.left + box.width / 2
    }
  }

  shouldInitDocSearch() {
    if (!this.enableDocSearch && this.hasDocSearchRendered) {
      throw new Error('You need to pass docSearch: { apiKey, indexName, inputSelector } to communityHeader function in order to initialise docSearch');
    }
  }

  checkDocSearch(docSearch = false) {
    if (docSearch) return docSearch;

    if (typeof window.docsearch === "function" || typeof docsearch === "function") {
      return docsearch;
    }
  }

  verifyDocSearchParams(docSearchCredentials) {
    return (docSearchCredentials &&
      docSearchCredentials.apiKey &&
      docSearchCredentials.indexName &&
      docSearchCredentials.inputSelector) ? true : false;
  }

  triggerMenu(event) {

    const dropdown = event.target.dataset.dropdown;
    const newTarget = this.menuDropdowns[dropdown].content;
    const newContent = this.menuDropdowns[dropdown].parent;

    const navItem = this.calculatePosition(event.target);
    const newTargetCoordinates = this.calculatePosition(newTarget);
    const menuContainerOffset = this.calculatePosition(this.menuContainer);
    let leftDistance;

    const scaleFactors = {
      X: newTargetCoordinates.realWidth / this.INIT_VAL.WIDTH,
      Y: newTargetCoordinates.realHeight / this.INIT_VAL.HEIGHT
    }

    leftDistance = (navItem.center - menuContainerOffset.left) + "px";

    if(menuContainerOffset.left < 20){
      leftDistance = "calc(50% - 36px)"
    }

    this.navBg.style.cssText = `
      transform: translateX(${leftDistance}) scale(${scaleFactors.X}, ${scaleFactors.Y})`;

    this.navArrow.style.cssText = `
      transform: translateX(${leftDistance}) rotate(45deg)`;

    this.dropDownContainer.style.cssText = `
      transform: translateX(${leftDistance});
      width: ${newTargetCoordinates.realWidth}px;
      height: ${newTargetCoordinates.realHeight + 10}px;`;

    this.dropdownRoot.style.pointerEvents = "auto";

    Object.keys(this.menuDropdowns).forEach(key => {
      if (key === dropdown) {
        this.menuDropdowns[key].parent.classList.add('active');
      } else {
        this.menuDropdowns[key].parent.classList.remove('active');
      }
    })

    if (!this.menuState.isOpen) {
      setTimeout(() => {
        this.navRoot.className = "algc-dropdownroot activeDropdown";
      }, 50);
    }

    window.clearTimeout(this.disableTransitionTimeout);
    this.menuState.isOpen = true;
  }

  shouldTriggerMenu(event) {
    if(this.menuState.isOpen) { 
      this.triggerMenu(event);
    } else {
      this.triggerMenuTimeout = setTimeout(()=>{
        this.triggerMenu(event);
      }, 200);
    }
  }

  closeMenu(event) {
    window.clearTimeout(this.triggerMenuTimeout);
    this.menuState.isOpen = false;
    this.disableTransitionTimeout = setTimeout(() => {
      this.dropdownRoot.style.pointerEvents = "none";
      this.navRoot.className = "algc-dropdownroot notransition"
    }, 50);
  }

  toggleMobileMenu(event) {
    this.mobileMenuButton.classList.toggle('algc-openmobile--open');
    this.mobileMenu.classList.toggle('algc-mobilemenu--open');
  }

  // Search
  docSearchToggling() {
    this.searchInput = document.querySelector(this.docSearchCredentials.inputSelector);
    const openSearchInput = () => {
      this.searchContainer.classList.add('open');
      this.searchInput.focus();
    }

    const closeSearchInput = () => {
      this.searchInput.blur();
      this.searchContainer.classList.remove('open');
    }

    const emptySearchInput = () => {
      if (this.searchInput.value !== '') {
        this.searchInput.value = '';
      } else {
        closeSearchInput();
      }
    }
    this.searchInput.setAttribute('value', '');
    this.searchIcon.addEventListener('click', openSearchInput);
    this.cancelIcon.addEventListener('click', emptySearchInput);
  };

  initDocSearch() {
    this.docSearchToggling();
    this.docSearchInit(this.docSearchCredentials);
  }

  initDocSearchStrategy() {
    if (this.enableDocSearch && typeof this.docSearchInit === "function") {
      this.initDocSearch();

    } else if (this.docSearch === "lazy") {

      const docSearchScript = document.createElement('script');
      docSearchScript.type = 'text/javascript';
      docSearchScript.async = true;
      document.body.appendChild(docSearchScript);

      docSearchScript.onload = () => {
        this.docSearchInit = docsearch;
        this.initDocSearch();
      };

      docSearchScript.src = "https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js";
    }
  }

  openSublist(node) {
    const parent = node.parentNode;
    this.subListHolders.forEach(holder => {
      if (holder === parent && !parent.classList.contains('open')) {
        holder.classList.add('open');
      } else {
        holder.classList.remove('open');
      }
    })
  }

  closeSubLists(event) {
    this.subListHolders.forEach(holder => holder.classList.remove('open'));
  }

  bindListeners() {
    var that = this;
    this.subList.forEach(link => {
      link.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        that.openSublist(this);
      });
    });

    this.menuTriggers.forEach(item => {
      item.addEventListener('mouseenter', this.shouldTriggerMenu);
      item.addEventListener('focus', this.triggerMenu);
    });

    this.navItems.forEach(item => {
      item.addEventListener('mouseleave', this.closeMenu);
    });

    this.navContainer.addEventListener('mouseenter', () => {
      clearTimeout(this.disableTransitionTimeout);
    });

    this.mobileMenuButton.addEventListener('click', this.toggleMobileMenu);
    document.addEventListener('click', this.closeSubLists);
    document.querySelector('.algc-dropdownroot__dropdowncontainer').addEventListener('mouseleave', this.closeMenu);
  }
}

module.exports = communityHeader
