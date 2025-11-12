const API_URL = 'https://tasks-service-maks1394.amvera.io';

interface CreateTask {
  name: string;
  info: string;
  isImportant: boolean;
  isCompleted: boolean;
}

interface Task extends CreateTask {
  id: number;
}

abstract class FetchClient {
  protected async fetchRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}

class RequestTaskService extends FetchClient {
  async getAllTasks(): Promise<Task[]> {
    console.log('→ GET /tasks');
    const tasks = await this.fetchRequest<Task[]>('/tasks');
    console.log(`Всего задач: ${tasks.length}`);
    return tasks;
  }

  async createTask(taskData: CreateTask): Promise<Task> {
    console.log('→ POST /tasks', taskData);
    const created = await this.fetchRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    console.log(`Создана задача #${created.id}: ${created.name}`);
    return created;
  }

  async getTaskById(id: number): Promise<Task> {
    console.log(`→ GET /tasks/${id}`);
    const task = await this.fetchRequest<Task>(`/tasks/${id}`);
    console.log(`Задача ${id}:`, task.name);
    return task;
  }

  async updateTask(id: number, updates: Partial<CreateTask>): Promise<Task> {
    console.log(`→ PUT /tasks/${id}`, updates);
    const updated = await this.fetchRequest<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    console.log(`Обновлена задача ${id}`);
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    console.log(`→ DELETE /tasks/${id}`);
    await this.fetchRequest<void>(`/tasks/${id}`, { method: 'DELETE' });
    console.log(`Удалена задача ${id}`);
  }
}

const taskService = new RequestTaskService();

taskService.getAllTasks();

taskService.createTask({
  name: 'Тест',
  info: '',
  isImportant: true,
  isCompleted: false,
});
