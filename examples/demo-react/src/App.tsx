/* eslint-disable react/react-in-jsx-scope */
import { version } from '@docsearch/react';
import type { JSX } from 'react';

import './App.css';
import '@docsearch/css/dist/style.css';

import Basic from './examples/basic';
import BasicAskAI from './examples/basic-askai';
import WHitComponent from './examples/w-hit-component';
import WTransformItems from './examples/w-hit-transformItems';

function App(): JSX.Element {
  return (
    <div className="body-container">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">DocSearch v{version}</h1>
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
            <p className="section-description">search with askai integration</p>
            <div className="search-wrapper">
              <BasicAskAI />
            </div>
          </section>

          <section className="demo-section">
            <p className="section-description">custom hit rendering</p>
            <div className="search-wrapper">
              <WHitComponent />
            </div>
          </section>

          <section className="demo-section">
            <p className="section-description">transform items before rendering</p>
            <div className="search-wrapper">
              <WTransformItems />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
