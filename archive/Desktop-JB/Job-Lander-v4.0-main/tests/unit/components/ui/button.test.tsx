import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
    
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'shadow-xs');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border-transparent');
    
    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button');
    // The link variant has unique styling, check for a stable class
    expect(button).toHaveClass('min-h-9'); 
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-8', 'text-xs', 'px-3');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-10', 'rounded-md', 'px-8');
    
    rerender(<Button size="icon">📧</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'w-9');
  });

  it('handles click events', () => {
    const handleClick = vitest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    const handleClick = vitest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('forwards custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards other HTML attributes', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );
    
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('supports ref forwarding', () => {
    let buttonRef: HTMLButtonElement | null = null;
    
    render(
      <Button
        ref={(ref) => {
          buttonRef = ref;
        }}
      >
        Ref Button
      </Button>
    );
    
    expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
  });

  it('has proper accessibility attributes', () => {
    render(
      <Button aria-label="Close dialog" disabled>
        ×
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
    expect(button).toHaveAttribute('disabled');
  });
});