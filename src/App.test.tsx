import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the museum wordmark and the 18-body index', () => {
    render(<App />);
    expect(screen.getByText('星球博物馆')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /地球/ })).toBeInTheDocument();
  });
});
