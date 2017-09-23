import React from 'react';
import StackedBoxes from './StackedBoxes';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<StackedBoxes perspective={2} numBoxes={2} />).toJSON();
  expect(rendered).toBeTruthy();
});

it('renders a different number of children based on a property', () => {
  const lowerBound = 1;
  const upperBound = 6;

  for(let i = lowerBound; i < upperBound + 1; i++) {
    const rendered = renderer.create(<StackedBoxes perspective={2} numBoxes={i} />).toJSON();
    expect(rendered.children.length).toBe(i)
  }
});
