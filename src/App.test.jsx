import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders javascript lesson content', () => {
  render(<App />);
  const lessonTitle = screen.getByText(/Leçon 1 : Bases de JavaScript/i);
  expect(lessonTitle).toBeInTheDocument();
});
