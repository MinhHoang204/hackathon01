interface ITodo {
    id: number;
    name: string;
    completed: boolean;
}

class TodoList {
    private todos: ITodo[] = [];
    private localStorageKey = 'todos';

    constructor() {
        this.loadFromLocalStorage();
        this.render();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        document.getElementById('btn-add')!.addEventListener('click', () => this.addTask());
        document.getElementById('btn-delete-done')!.addEventListener('click', () => this.deleteDoneTasks());
        document.getElementById('btn-delete-all')!.addEventListener('click', () => this.deleteAllTasks());
        document.getElementById('task-list')!.addEventListener('click', (event) => this.handleTaskActions(event));
    }

    private saveToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
    }

    private loadFromLocalStorage() {
        const savedTodos = localStorage.getItem(this.localStorageKey);
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
        }
    }

    private render() {
        const taskList = document.getElementById('task-list')!;
        taskList.innerHTML = '';

        this.todos.forEach(todo => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('work-item');
            if (todo.completed) taskItem.classList.add('completed');
            taskItem.innerHTML = `
                <div>
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" class="toggle-completed">
                    <p>${todo.name}</p>
                </div>
                <div>
                    <i class="fa-solid fa-pen-to-square edit-task" data-id="${todo.id}"></i>
                    <i class="fa-solid fa-trash-can delete-task" data-id="${todo.id}"></i>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    private addTask() {
        const input = document.getElementById('new-task') as HTMLInputElement;
        const taskName = input.value.trim();
        if (!taskName) {
            alert('Task name cannot be empty');
            return;
        }
        if (this.todos.some(todo => todo.name === taskName)) {
            alert('Task name already exists');
            return;
        }
        const newTask: ITodo = { id: Date.now(), name: taskName, completed: false };
        this.todos.push(newTask);
        this.saveToLocalStorage();
        this.render();
        input.value = '';
    }

    private toggleCompleted(id: number) {
        const task = this.todos.find(todo => todo.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    private deleteTask(id: number) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToLocalStorage();
            this.render();
        }
    }

    private deleteDoneTasks() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveToLocalStorage();
        this.render();
    }

    private deleteAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.todos = [];
            this.saveToLocalStorage();
            this.render();
        }
    }

    private handleTaskActions(event: Event) {
        const target = event.target as HTMLElement;
        const id = parseInt(target.getAttribute('data-id')!);
        if (target.classList.contains('toggle-completed')) {
            this.toggleCompleted(id);
        } else if (target.classList.contains('delete-task')) {
            this.deleteTask(id);
        }
    }
}

const todoList = new TodoList();