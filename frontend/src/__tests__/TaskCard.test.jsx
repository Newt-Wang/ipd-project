import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';
import { ThemeContext } from '../context/ThemeContext';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  priority: 'High',
  category: 'Work',
  completed: false,
  due_date: new Date(Date.now() + 86400000).toISOString(),
};

const mockThemeContext = {
  isDark: false,
};

describe('TaskCard Component', () => {
  it('should render task title and description', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render priority badge', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('💼 Work')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} onClick={mockOnClick} />
      </ThemeContext.Provider>
    );
    
    fireEvent.click(screen.getByText('Test Task').parentElement);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should call onToggleStatus when checkbox is clicked', () => {
    const mockOnToggleStatus = jest.fn();
    
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} onToggleStatus={mockOnToggleStatus} />
      </ThemeContext.Provider>
    );
    
    const checkbox = screen.getByRole('button', { name: 'Toggle task status' });
    fireEvent.click(checkbox);
    expect(mockOnToggleStatus).toHaveBeenCalled();
  });

  it('should show line-through for completed tasks', () => {
    const completedTask = { ...mockTask, completed: true };
    
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={completedTask} />
      </ThemeContext.Provider>
    );
    
    const title = screen.getByText('Test Task');
    expect(title).toHaveStyle('text-decoration: line-through');
  });

  it('should show overdue label for overdue tasks', () => {
    const overdueTask = {
      ...mockTask,
      completed: false,
      due_date: new Date(Date.now() - 86400000).toISOString(),
    };
    
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={overdueTask} />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText((content, element) => content.includes('Overdue'))).toBeInTheDocument();
  });

  it('should render in status view mode', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} viewMode="status" />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render in category view mode', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} viewMode="category" />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should render in all view mode (default)', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <TaskCard task={mockTask} viewMode="all" />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
