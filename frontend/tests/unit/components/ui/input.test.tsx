import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { Input } from '@/components/ui/input';

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

function setValue(input: HTMLInputElement, value: string) {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      // Fallback for environments without descriptor
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  });
}

function focusElement(element: HTMLElement) {
  act(() => {
    element.focus();
  });
}

function blurElement(element: HTMLElement) {
  act(() => {
    element.blur();
  });
}

describe('Input Component', () => {
  it('renders input element', () => {
    const { container, unmount } = render(<Input />);

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    unmount();
  });

  it('applies default classes', () => {
    const { container, unmount } = render(<Input />);

    const input = container.querySelector('input');
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
    );
    unmount();
  });

  it('handles text input', () => {
    const { container, unmount } = render(<Input placeholder="Enter text" />);

    const input = container.querySelector('input[placeholder="Enter text"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    setValue(input!, 'Hello World');
    expect(input).toHaveValue('Hello World');
    unmount();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    const { container, unmount } = render(<Input onChange={handleChange} />);

    const input = container.querySelector('input') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    setValue(input!, 'test');

    expect(handleChange).toHaveBeenCalled();
    unmount();
  });

  it('can be disabled', () => {
    const { container, unmount } = render(<Input disabled />);

    const input = container.querySelector('input');
    expect(input).toBeDisabled();
    unmount();
  });

  it('supports different input types', () => {
    const { container, rerender, unmount } = render(<Input type="email" />);

    let input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" defaultValue="" />);
    input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="number" defaultValue="0" />);
    input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'number');
    unmount();
  });

  it('forwards custom className', () => {
    const { container, unmount } = render(<Input className="custom-input" />);

    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-input');
    unmount();
  });

  it('supports placeholder text', () => {
    const { container, unmount } = render(<Input placeholder="Enter your email" />);

    const input = container.querySelector('input[placeholder="Enter your email"]');
    expect(input).toBeInTheDocument();
    unmount();
  });

  it('supports default value', () => {
    const { container, unmount } = render(<Input defaultValue="Default text" />);

    const input = container.querySelector('input');
    expect(input).toHaveValue('Default text');
    unmount();
  });

  it('supports controlled value', () => {
    const { container, rerender, unmount } = render(<Input value="Controlled" onChange={() => {}} />);

    let input = container.querySelector('input');
    expect(input).toHaveValue('Controlled');

    rerender(<Input value="Updated" onChange={() => {}} />);
    input = container.querySelector('input');
    expect(input).toHaveValue('Updated');
    unmount();
  });

  it('supports required attribute', () => {
    const { container, unmount } = render(<Input required />);

    const input = container.querySelector('input');
    expect(input).toBeRequired();
    unmount();
  });

  it('supports maxLength attribute', () => {
    const { container, unmount } = render(<Input maxLength={10} />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('maxLength', '10');
    unmount();
  });

  it('supports aria attributes', () => {
    const { container, unmount } = render(
      <Input aria-label="Email input" aria-describedby="email-help" aria-invalid />,
    );

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-label', 'Email input');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    unmount();
  });

  it('supports ref forwarding', () => {
    let inputRef: HTMLInputElement | null = null;

    const { unmount } = render(
      <Input
        ref={(ref) => {
          inputRef = ref;
        }}
      />,
    );

    expect(inputRef).toBeInstanceOf(HTMLInputElement);
    unmount();
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    const { container, unmount } = render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = container.querySelector('input') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    focusElement(input!);
    expect(handleFocus).toHaveBeenCalledOnce();

    blurElement(input!);
    expect(handleBlur).toHaveBeenCalledOnce();
    unmount();
  });

  it('supports email validation', () => {
    const { container, unmount } = render(<Input type="email" />);

    const input = container.querySelector('input') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    setValue(input!, 'invalid-email');
    expect(input).toHaveValue('invalid-email');

    act(() => {
      input!.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(input!.checkValidity()).toBe(false);
    unmount();
  });

  it('supports custom data attributes', () => {
    const { container, unmount } = render(<Input data-testid="custom-input" />);

    const input = container.querySelector('[data-testid="custom-input"]');
    expect(input).toBeInTheDocument();
    unmount();
  });

  it('supports spellCheck attribute', () => {
    const { container, unmount } = render(<Input spellCheck={false} />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('spellcheck', 'false');
    unmount();
  });

  it('supports autoComplete attribute', () => {
    const { container, unmount } = render(<Input autoComplete="email" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('autocomplete', 'email');
    unmount();
  });

  it('supports autoFocus attribute', () => {
    const { container, unmount } = render(<Input autoFocus />);

    const input = container.querySelector('input');
    expect(document.activeElement).toBe(input);
    unmount();
  });

  it('supports pattern attribute', () => {
    const { container, unmount } = render(<Input pattern="[A-Za-z]+" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
    unmount();
  });

  it('supports min and max attributes', () => {
    const { container, unmount } = render(<Input type="number" min={1} max={10} />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
    unmount();
  });

  it('supports step attribute', () => {
    const { container, unmount } = render(<Input type="number" step={2} />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('step', '2');
    unmount();
  });

  it('supports multiple attribute', () => {
    const { container, unmount } = render(<Input type="file" multiple />);

    const input = container.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('multiple');
    unmount();
  });

  it('supports readOnly attribute', () => {
    const { container, unmount } = render(<Input readOnly />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('readonly');
    unmount();
  });

  it('supports name attribute', () => {
    const { container, unmount } = render(<Input name="email" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('name', 'email');
    unmount();
  });

  it('supports autoCapitalize attribute', () => {
    const { container, unmount } = render(<Input autoCapitalize="words" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('autocapitalize', 'words');
    unmount();
  });

  it('supports inputMode attribute', () => {
    const { container, unmount } = render(<Input inputMode="numeric" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    unmount();
  });

  it('supports list attribute', () => {
    const { container, unmount } = render(<Input list="options" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('list', 'options');
    unmount();
  });

  it('supports form attribute', () => {
    const { container, unmount } = render(<Input form="user-form" />);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('form', 'user-form');
    unmount();
  });
});
