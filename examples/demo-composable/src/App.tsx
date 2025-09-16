/* eslint-disable react/react-in-jsx-scope */
import type { JSX } from 'react';

import './App.css';
import '@docsearch/css/dist/style.css';

import Basic from './examples/basic';
import BothExample from './examples/both';
import SidepanelExample from './examples/sidepanel';

function App(): JSX.Element {
  return (
    <div className="body-container">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">DocSearch Composable</h1>
          <p className="app-subtitle">Experience the power of intelligent documentation search</p>
        </header>

        <main>
          <section className="demo-section">
            <p className="section-description">basic search functionality</p>
            <div className="search-wrapper">
              <Basic />
            </div>
          </section>

          <section className="demo-section">
            <p className="section-description">sidepanel</p>
            <div className="search-wrapper">
              <SidepanelExample />
            </div>
          </section>

          <section className="demo-section">
            <p className="section-description">both</p>
            <div className="search-wrapper">
              <BothExample />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
