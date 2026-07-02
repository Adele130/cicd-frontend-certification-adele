import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskItem } from '../components/TaskItem';

const mockTask = {
  id: 1,
  title: 'T1',
  description: 'Desc',
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => vi.restoreAllMocks());

describe('TaskItem', () => {
  it('renders content and toggles', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const user = userEvent.setup();
    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('allows editing and saving', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /modifier/i }));
    const input = screen.getByLabelText('Modifier le titre');
    await user.clear(input);
    await user.type(input, '  Edited  ');
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));
    expect(onEdit).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Edited' }));
  });

  it('requires double click to delete (confirm)', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const user = userEvent.setup();
    const delBtn = screen.getByRole('button', { name: /supprimer/i });
    await user.click(delBtn);
    // button switches to a confirmation state
    expect(delBtn).toHaveTextContent('⚠️');
    await user.click(delBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
