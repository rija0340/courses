import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LearnHub title', () => {
  render(<App />);
  const linkElement = screen.getByText(/LearnHub/i);
  expect(linkElement).toBeInTheDocument();
});
