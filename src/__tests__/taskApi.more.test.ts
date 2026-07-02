import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTask, createTask, updateTask, deleteTask } from '../api/taskApi';

const mockTask = {
  id: 1,
  title: 'Test',
  description: null,
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('taskApi additional', () => {
  it('getTask returns single task', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockTask) }));
    const task = await getTask(1);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1');
  });

  it('createTask sends body and returns created task', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockTask) }));
    const created = await createTask({ title: 'Test' });
    expect(created).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks', expect.objectContaining({ method: 'POST' }));
  });

  it('updateTask sends body and returns updated task', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockTask) }));
    const updated = await updateTask(1, { title: 'Updated' });
    expect(updated).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', expect.objectContaining({ method: 'PUT' }));
  });

  it('deleteTask throws on non-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: () => Promise.resolve('err') }));
    await expect(deleteTask(1)).rejects.toThrow('HTTP 500: err');
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', expect.objectContaining({ method: 'DELETE' }));
  });
});
