import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

it('contains a single stacked element', () => {
  const rendered = renderer.create(<App />);
  expect(rendered.toJSON().children.length).toBe(1);
});
