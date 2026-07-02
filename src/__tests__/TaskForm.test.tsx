import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  it('shows validation error when title is empty', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    const submit = screen.getByRole('button', { name: /ajouter/i });
    await user.click(submit);
    expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values and resets in create mode', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    const title = screen.getByLabelText('Titre');
    const desc = screen.getByLabelText('Description');
    await user.type(title, '  Nouvelle  ');
    await user.type(desc, '  une desc  ');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Nouvelle', description: 'une desc' });
    expect((title as HTMLInputElement).value).toBe('');
    expect((desc as HTMLTextAreaElement).value).toBe('');
  });
});
