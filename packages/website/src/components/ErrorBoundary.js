/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.

    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      info,
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops, something went wrong :(</h1>
          <p>The error: {this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
