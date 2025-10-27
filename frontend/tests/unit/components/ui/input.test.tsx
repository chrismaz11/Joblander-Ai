import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  const user = userEvent.setup();

  it('renders input element', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'flex', 'h-9', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'px-3', 'py-2'
    );
  });

  it('handles text input', async () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    
    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('handles change events', async () => {
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    input = screen.getByDisplayValue('') as HTMLInputElement;
    expect(input.type).toBe('password');
    
    rerender(<Input type="number" />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('forwards custom className', () => {
    render(<Input className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('supports placeholder text', () => {
    render(<Input placeholder="Enter your email" />);
    
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('supports default value', () => {
    render(<Input defaultValue="Default text" />);
    
    const input = screen.getByDisplayValue('Default text');
    expect(input).toBeInTheDocument();
  });

  it('supports controlled value', () => {
    const { rerender } = render(<Input value="Controlled" onChange={() => {}} />);
    
    let input = screen.getByDisplayValue('Controlled');
    expect(input).toBeInTheDocument();
    
    rerender(<Input value="Updated" onChange={() => {}} />);
    input = screen.getByDisplayValue('Updated');
    expect(input).toBeInTheDocument();
  });

  it('supports required attribute', () => {
    render(<Input required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('supports maxLength attribute', () => {
    render(<Input maxLength={10} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('supports aria attributes', () => {
    render(
      <Input
        aria-label="Email input"
        aria-describedby="email-help"
        aria-invalid={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Email input');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports ref forwarding', () => {
    let inputRef: HTMLInputElement | null = null;
    
    render(
      <Input
        ref={(ref) => {
          inputRef = ref;
        }}
      />
    );
    
    expect(inputRef).toBeInstanceOf(HTMLInputElement);
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledOnce();
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalledOnce();
  });

  it('supports email validation', async () => {
    render(<Input type="email" />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'invalid-email');
    expect(input).toHaveValue('invalid-email');
    
    await user.clear(input);
    await user.type(input, 'valid@example.com');
    expect(input).toHaveValue('valid@example.com');
  });

  it('maintains accessibility standards', () => {
    render(
      <Input
        id="test-input"
        name="testInput"
        aria-label="Test input field"
        placeholder="Type something..."
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testInput');
    expect(input).toHaveAccessibleName('Test input field');
  });
});