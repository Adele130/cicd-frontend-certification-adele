import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      { id: 1, title: 'A', description: null, completed: false, createdAt: '', updatedAt: '' },
      { id: 2, title: 'B', description: null, completed: true, createdAt: '', updatedAt: '' },
    ],
    loading: false,
    error: null,
    loadTasks: vi.fn(),
    addTask: vi.fn(),
    editTask: vi.fn(),
    removeTask: vi.fn(),
    toggleComplete: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders header stats and child components', () => {
    // dynamic import after mocking so mock is applied
    return import('../App').then((m) => {
      const App = m.default;
      render(React.createElement(App));
      // TaskForm should be present
      expect(screen.getByTestId('task-form')).toBeInTheDocument();
      // TaskList should be present because tasks length > 0
      expect(screen.getByTestId('task-list')).toBeInTheDocument();
      // Stat labels present
      expect(screen.getByText('Terminées')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
  });
});
