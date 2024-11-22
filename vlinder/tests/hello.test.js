import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hello from '@/components/hello.tsx';

test('renders Hello component with "Hello World" text', () => {
  render(<Hello />);
  var helloElement = null;
  if (process.env.LANDING_TEXT != null) {
    helloElement = screen.getByText(process.env.LANDING_TEXT);
  }
  else {
    helloElement = screen.getByText(/Hello World/i);
  }
  expect(helloElement).toBeInTheDocument();
});

