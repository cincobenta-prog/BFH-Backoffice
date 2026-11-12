import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

describe('App Root Render Test', () => {
  it('renders App without crashing in public mode', () => {
    const html = renderToString(React.createElement(App));
    expect(html.length).toBeGreaterThan(100);
    expect(html).toContain('Benta');
  });
});
