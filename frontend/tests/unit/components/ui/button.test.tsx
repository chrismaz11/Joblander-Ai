import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });

  return {
    container,
    rerender(next: React.ReactElement) {
      act(() => {
        root.render(next);
      });
    },
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function click(element: HTMLElement) {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

function getButton(container: HTMLElement) {
  const button = container.querySelector('button');
  if (!button) {
    throw new Error('Button element not found');
  }
  return button;
}

describe('Button Component', () => {
  it('renders button with text', () => {
    const { container, unmount } = render(<Button>Click me</Button>);

    const button = getButton(container);
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/click me/i);
    unmount();
  });

  it('applies default variant and size', () => {
    const { container, unmount } = render(<Button>Default Button</Button>);

    const button = getButton(container);
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    unmount();
  });

  it('applies variant classes correctly', () => {
    const { container, rerender, unmount } = render(
      <Button variant="destructive">Delete</Button>,
    );

    let button = getButton(container);
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');

    rerender(<Button variant="outline">Outline</Button>);
    button = getButton(container);
    expect(button).toHaveClass('border', 'shadow-xs');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = getButton(container);
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = getButton(container);
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = getButton(container);
    expect(button).toHaveClass('border-transparent');

    rerender(<Button variant="link">Link</Button>);
    button = getButton(container);
    // The link variant has unique styling, check for a stable class
    expect(button).toHaveClass('min-h-9');
    unmount();
  });

  it('applies size classes correctly', () => {
    const { container, rerender, unmount } = render(<Button size="sm">Small</Button>);

    let button = getButton(container);
    expect(button).toHaveClass('min-h-8', 'text-xs', 'px-3');

    rerender(<Button size="lg">Large</Button>);
    button = getButton(container);
    expect(button).toHaveClass('min-h-10', 'rounded-md', 'px-8');

    rerender(<Button size="icon">📧</Button>);
    button = getButton(container);
    expect(button).toHaveClass('h-9', 'w-9');
    unmount();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { container, unmount } = render(<Button onClick={handleClick}>Clickable</Button>);

    const button = getButton(container);
    click(button);

    expect(handleClick).toHaveBeenCalledOnce();
    unmount();
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    const { container, unmount } = render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );

    const button = getButton(container);
    expect(button).toBeDisabled();

    click(button);
    expect(handleClick).not.toHaveBeenCalled();
    unmount();
  });

  it('renders as child element when asChild is true', () => {
    const { container, unmount } = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = container.querySelector('a');
    if (!link) {
      throw new Error('Link not found');
    }
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    unmount();
  });

  it('forwards custom className', () => {
    const { container, unmount } = render(<Button className="custom-class">Custom</Button>);

    const button = getButton(container);
    expect(button).toHaveClass('custom-class');
    unmount();
  });

  it('forwards other HTML attributes', () => {
    const { container, unmount } = render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>,
    );

    const button = container.querySelector('[data-testid="submit-btn"]') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute('type', 'submit');
    unmount();
  });

  it('supports ref forwarding', () => {
    let buttonRef: HTMLButtonElement | null = null;

    const { unmount } = render(
      <Button
        ref={(ref) => {
          buttonRef = ref;
        }}
      >
        Ref Button
      </Button>,
    );

    expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
    unmount();
  });

  it('has proper accessibility attributes', () => {
    const { container, unmount } = render(
      <Button aria-label="Close dialog" disabled>
        ×
      </Button>,
    );

    const button = getButton(container);
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
    expect(button).toHaveAttribute('disabled');
    unmount();
  });
});
