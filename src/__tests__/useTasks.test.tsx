import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasks } from '../hooks/useTasks';

vi.mock('../api/taskApi', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import * as api from '../api/taskApi';

function TestComp() {
  const { tasks, loading, error, loadTasks, addTask, editTask, removeTask, toggleComplete } = useTasks();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'idle'}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="tasks">{JSON.stringify(tasks)}</div>
      <button onClick={() => loadTasks()}>load</button>
      <button onClick={() => addTask({ title: 'new' })}>add</button>
      <button onClick={() => editTask(2, { title: 'edited' })}>edit</button>
      <button onClick={() => removeTask(2)}>remove</button>
      <button onClick={() => toggleComplete(2)}>toggle</button>
    </div>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useTasks hook', () => {
  it('loads tasks on demand', async () => {
    (api.getTasks as any).mockResolvedValue([{ id: 1, title: 'A', description: null, completed: false, createdAt: '', updatedAt: '' }]);
    render(<TestComp />);
    await userEvent.click(screen.getByText('load'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('"title":"A"'));
  });

  it('adds, edits and removes tasks', async () => {
    (api.getTasks as any).mockResolvedValue([]);
    (api.createTask as any).mockResolvedValue({ id: 2, title: 'new', description: null, completed: false, createdAt: '', updatedAt: '' });
    (api.updateTask as any).mockResolvedValue({ id: 2, title: 'edited', description: null, completed: false, createdAt: '', updatedAt: '' });
    (api.deleteTask as any).mockResolvedValue(undefined);

    render(<TestComp />);
    // load initial empty
    await userEvent.click(screen.getByText('load'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toBe('[]'));

    // add
    await userEvent.click(screen.getByText('add'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('"title":"new"'));

    // edit
    await userEvent.click(screen.getByText('edit'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('"title":"edited"'));

    // remove
    await userEvent.click(screen.getByText('remove'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toBe('[]'));
  });
});
