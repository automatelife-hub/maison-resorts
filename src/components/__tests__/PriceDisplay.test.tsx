/**
 * Test cases for PriceDisplay component
 *
 * Scenarios:
 * 1. Render main price with USD
 * 2. Render main price with EUR
 * 3. Render original price when provided
 * 4. Do not render original price when not provided
 * 5. Apply custom className
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '../PriceDisplay';
import { describe, it, expect } from 'vitest';

describe('PriceDisplay', () => {
  it('renders the price formatted in USD', () => {
    render(<PriceDisplay price={100} currency="USD" />);
    // Intl.NumberFormat might use non-breaking spaces or different symbols depending on environment
    // We check for the presence of the numeric value and the currency symbol/code
    const priceElement = screen.getByText(/\$100/);
    expect(priceElement).toBeInTheDocument();
  });

  it('renders the price formatted in EUR', () => {
    render(<PriceDisplay price={100} currency="EUR" />);
    // EUR formatting in en-US usually is €100.00 or €100
    const priceElement = screen.getByText(/€100/);
    expect(priceElement).toBeInTheDocument();
  });

  it('renders the original price with line-through when provided', () => {
    render(<PriceDisplay price={100} currency="USD" originalPrice={150} />);
    const originalPriceElement = screen.getByText(/\$150/);
    expect(originalPriceElement).toBeInTheDocument();
    expect(originalPriceElement).toHaveClass('line-through');

    const priceElement = screen.getByText(/\$100/);
    expect(priceElement).toBeInTheDocument();
  });

  it('does not render original price when not provided', () => {
    const { container } = render(<PriceDisplay price={100} currency="USD" />);
    // Should not find a strike-through price
    const originalPrice = container.querySelector('.line-through');
    expect(originalPrice).not.toBeInTheDocument();
  });

  it('applies custom className to the container', () => {
    const customClass = 'my-custom-class';
    const { container } = render(
      <PriceDisplay price={100} currency="USD" className={customClass} />
    );
    expect(container.firstChild).toHaveClass(customClass);
  });
});
