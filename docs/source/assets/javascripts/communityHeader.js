'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main header function with docsearch
 * @param  {Object} docSearch config
 */

var communityHeader = function () {
  function communityHeader(docSearchCredentials, docSearch) {
    var _this = this;

    _classCallCheck(this, communityHeader);

    this.docSearchCredentials = docSearchCredentials;
    this.docSearch = docSearch || null;

    this.menuState = {
      isOpen: false,
      isOpenMobile: false
    };

    this.INIT_VAL = {
      WIDTH: 490,
      HEIGHT: 360
    };

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
    this.subListHolders = [].concat(_toConsumableArray(this.subList)).map(function (node) {
      return node.parentNode;
    });
    this.menuDropdowns = {};

    [].forEach.call(document.querySelectorAll('[data-dropdown-content]'), function (item) {
      _this.menuDropdowns[item.dataset.dropdownContent] = {
        parent: item.parentNode,
        content: item
      };
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

  _createClass(communityHeader, [{
    key: 'calculatePosition',
    value: function calculatePosition(sourceNode) {
      var box = sourceNode.getBoundingClientRect();
      var realWidth = sourceNode.offsetWidth;
      var realHeight = sourceNode.offsetHeight;

      return {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        realWidth: realWidth,
        realHeight: realHeight,
        center: box.left + box.width / 2
      };
    }
  }, {
    key: 'shouldInitDocSearch',
    value: function shouldInitDocSearch() {
      if (!this.enableDocSearch && this.hasDocSearchRendered) {
        throw new Error('You need to pass docSearch: { apiKey, indexName, inputSelector } to communityHeader function in order to initialise docSearch');
      }
    }
  }, {
    key: 'checkDocSearch',
    value: function checkDocSearch() {
      var docSearch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (docSearch) return docSearch;

      if (typeof window.docsearch === "function" || typeof docsearch === "function") {
        return docsearch;
      }
    }
  }, {
    key: 'verifyDocSearchParams',
    value: function verifyDocSearchParams(docSearchCredentials) {
      return docSearchCredentials && docSearchCredentials.apiKey && docSearchCredentials.indexName && docSearchCredentials.inputSelector ? true : false;
    }
  }, {
    key: 'triggerMenu',
    value: function triggerMenu(event) {
      var _this2 = this;

      var dropdown = event.target.dataset.dropdown;
      var newTarget = this.menuDropdowns[dropdown].content;
      var newContent = this.menuDropdowns[dropdown].parent;

      var navItem = this.calculatePosition(event.target);
      var newTargetCoordinates = this.calculatePosition(newTarget);
      var menuContainerOffset = this.calculatePosition(this.menuContainer);
      var leftDistance = void 0;

      var scaleFactors = {
        X: newTargetCoordinates.realWidth / this.INIT_VAL.WIDTH,
        Y: newTargetCoordinates.realHeight / this.INIT_VAL.HEIGHT
      };

      leftDistance = navItem.center - menuContainerOffset.left + "px";

      if (menuContainerOffset.left < 20) {
        leftDistance = "calc(50% - 36px)";
      }

      this.navBg.style.cssText = '\n      transform: translateX(' + leftDistance + ') scale(' + scaleFactors.X + ', ' + scaleFactors.Y + ')';

      this.navArrow.style.cssText = '\n      transform: translateX(' + leftDistance + ') rotate(45deg)';

      this.dropDownContainer.style.cssText = '\n      transform: translateX(' + leftDistance + ');\n      width: ' + newTargetCoordinates.realWidth + 'px;\n      height: ' + (newTargetCoordinates.realHeight + 10) + 'px;';

      this.dropdownRoot.style.pointerEvents = "auto";

      Object.keys(this.menuDropdowns).forEach(function (key) {
        if (key === dropdown) {
          _this2.menuDropdowns[key].parent.classList.add('active');
        } else {
          _this2.menuDropdowns[key].parent.classList.remove('active');
        }
      });

      if (!this.menuState.isOpen) {
        setTimeout(function () {
          _this2.navRoot.className = "algc-dropdownroot activeDropdown";
        }, 50);
      }

      window.clearTimeout(this.disableTransitionTimeout);
      this.menuState.isOpen = true;
    }
  }, {
    key: 'shouldTriggerMenu',
    value: function shouldTriggerMenu(event) {
      var _this3 = this;

      if (this.menuState.isOpen) {
        this.triggerMenu(event);
      } else {
        this.triggerMenuTimeout = setTimeout(function () {
          _this3.triggerMenu(event);
        }, 200);
      }
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu(event) {
      var _this4 = this;

      window.clearTimeout(this.triggerMenuTimeout);
      this.menuState.isOpen = false;
      this.disableTransitionTimeout = setTimeout(function () {
        _this4.dropdownRoot.style.pointerEvents = "none";
        _this4.navRoot.className = "algc-dropdownroot notransition";
      }, 50);
    }
  }, {
    key: 'toggleMobileMenu',
    value: function toggleMobileMenu(event) {
      this.mobileMenuButton.classList.toggle('algc-openmobile--open');
      this.mobileMenu.classList.toggle('algc-mobilemenu--open');
    }

    // Search

  }, {
    key: 'docSearchToggling',
    value: function docSearchToggling() {
      var _this5 = this;

      this.searchInput = document.querySelector(this.docSearchCredentials.inputSelector);
      var openSearchInput = function openSearchInput() {
        _this5.searchContainer.classList.add('open');
        _this5.searchInput.focus();
      };

      var closeSearchInput = function closeSearchInput() {
        _this5.searchInput.blur();
        _this5.searchContainer.classList.remove('open');
      };

      var emptySearchInput = function emptySearchInput() {
        if (_this5.searchInput.value !== '') {
          _this5.searchInput.value = '';
        } else {
          closeSearchInput();
        }
      };
      this.searchInput.setAttribute('value', '');
      this.searchIcon.addEventListener('click', openSearchInput);
      this.cancelIcon.addEventListener('click', emptySearchInput);
    }
  }, {
    key: 'initDocSearch',
    value: function initDocSearch() {
      this.docSearchToggling();
      this.docSearchInit(this.docSearchCredentials);
    }
  }, {
    key: 'initDocSearchStrategy',
    value: function initDocSearchStrategy() {
      var _this6 = this;

      if (this.enableDocSearch && typeof this.docSearchInit === "function") {
        this.initDocSearch();
      } else if (this.docSearch === "lazy") {

        var docSearchScript = document.createElement('script');
        docSearchScript.type = 'text/javascript';
        docSearchScript.async = true;
        document.body.appendChild(docSearchScript);

        docSearchScript.onload = function () {
          _this6.docSearchInit = docsearch;
          _this6.initDocSearch();
        };

        docSearchScript.src = "https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js";
      }
    }
  }, {
    key: 'openSublist',
    value: function openSublist(node) {
      var parent = node.parentNode;
      this.subListHolders.forEach(function (holder) {
        if (holder === parent && !parent.classList.contains('open')) {
          holder.classList.add('open');
        } else {
          holder.classList.remove('open');
        }
      });
    }
  }, {
    key: 'closeSubLists',
    value: function closeSubLists(event) {
      this.subListHolders.forEach(function (holder) {
        return holder.classList.remove('open');
      });
    }
  }, {
    key: 'bindListeners',
    value: function bindListeners() {
      var _this7 = this;

      var that = this;
      this.subList.forEach(function (link) {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          that.openSublist(this);
        });
      });

      this.menuTriggers.forEach(function (item) {
        item.addEventListener('mouseenter', _this7.shouldTriggerMenu);
        item.addEventListener('focus', _this7.triggerMenu);
      });

      this.navItems.forEach(function (item) {
        item.addEventListener('mouseleave', _this7.closeMenu);
      });

      this.navContainer.addEventListener('mouseenter', function () {
        clearTimeout(_this7.disableTransitionTimeout);
      });

      this.mobileMenuButton.addEventListener('click', this.toggleMobileMenu);
      document.addEventListener('click', this.closeSubLists);
      document.querySelector('.algc-dropdownroot__dropdowncontainer').addEventListener('mouseleave', this.closeMenu);
    }
  }]);

  return communityHeader;
}();