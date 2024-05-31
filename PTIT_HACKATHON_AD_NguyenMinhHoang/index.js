"use strict";
class TodoList {
    todos = []
    localStorageKey = "todos"
  
    constructor() {
      this.loadFromLocalStorage()
      this.render()
      this.setupEventListeners()
    }
  
    setupEventListeners() {
      document
        .getElementById("btn-add")
        .addEventListener("click", () => this.addTask())
      document
        .getElementById("btn-delete-done")
        .addEventListener("click", () => this.deleteDoneTasks())
      document
        .getElementById("btn-delete-all")
        .addEventListener("click", () => this.deleteAllTasks())
      document
        .getElementById("task-list")
        .addEventListener("click", event => this.handleTaskActions(event))
    }
  
    saveToLocalStorage() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos))
    }
  
    loadFromLocalStorage() {
      const savedTodos = localStorage.getItem(this.localStorageKey)
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos)
      }
    }
  
    render() {
      const taskList = document.getElementById("task-list")
      taskList.innerHTML = ""
  
      this.todos.forEach(todo => {
        const taskItem = document.createElement("li")
        taskItem.classList.add("work-item")
        if (todo.completed) taskItem.classList.add("completed")
        taskItem.innerHTML = `
                  <div>
                      <input type="checkbox" ${
                        todo.completed ? "checked" : ""
                      } data-id="${todo.id}" class="toggle-completed">
                      <p>${todo.name}</p>
                  </div>
                  <div>
                      <i class="fa-solid fa-pen-to-square edit-task" data-id="${
                        todo.id
                      }"></i>
                      <i class="fa-solid fa-trash-can delete-task" data-id="${
                        todo.id
                      }"></i>
                  </div>
              `
        taskList.appendChild(taskItem)
      })
    }
  
    addTask() {
      const input = document.getElementById("new-task")
      const taskName = input.value.trim()
      if (!taskName) {
        alert("Task name cannot be empty")
        return
      }
      if (this.todos.some(todo => todo.name === taskName)) {
        alert("Task name already exists")
        return
      }
      const newTask = { id: Date.now(), name: taskName, completed: false }
      this.todos.push(newTask)
      this.saveToLocalStorage()
      this.render()
      input.value = ""
    }
  
    toggleCompleted(id) {
      const task = this.todos.find(todo => todo.id === id)
      if (task) {
        task.completed = !task.completed
        this.saveToLocalStorage()
        this.render()
      }
    }
  
    deleteTask(id) {
      if (confirm("Are you sure you want to delete this task?")) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this.saveToLocalStorage()
        this.render()
      }
    }
  
    deleteDoneTasks() {
      this.todos = this.todos.filter(todo => !todo.completed)
      this.saveToLocalStorage()
      this.render()
    }
  
    deleteAllTasks() {
      if (confirm("Are you sure you want to delete all tasks?")) {
        this.todos = []
        this.saveToLocalStorage()
        this.render()
      }
    }
  
    handleTaskActions(event) {
      const target = event.target
      const id = parseInt(target.getAttribute("data-id"))
      if (target.classList.contains("toggle-completed")) {
        this.toggleCompleted(id)
      } else if (target.classList.contains("delete-task")) {
        this.deleteTask(id)
      }
    }
  }
  
  const todoList = new TodoList()  