import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();
    this.currentFilters = {
      type: 'all',
      words: '',
      tag: 'all',
    };
    

    this.addTodoForm.onClick((title, description, tags) => this.addTodo(title, description, tags));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const todos = this.model.getTodos();
    this.refreshTagFilters(todos);
    todos.forEach((todo) => this.createRow(todo));
  }

  refreshTagFilters(todos = this.model.getTodos()) {
    const tags = new Set();
    todos.forEach((todo) => {
      (todo.tags || []).forEach((tag) => tags.add(tag));
    });

    this.filters.setTagOptions(
      Array.from(tags).sort((a, b) => a.localeCompare(b)),
      this.currentFilters.tag,
    );
  }

  filter(filters) {
    this.currentFilters = {
      type: filters.type || 'all',
      words: filters.words || '',
      tag: filters.tag || 'all',
    };

    const { type, words, tag } = this.currentFilters;
    const normalizedWords = words.trim().toLowerCase();
    const [, ...rows] = this.table.getElementsByTagName('tr');
    for (const row of rows) {
      const [title, description, tagsCell, completed] = row.children;
      let shouldHide = false;
      const rowTags = (row.dataset.tags || '').split(',').filter((value) => value !== '');

      if (normalizedWords) {
        const wordsSource = `${title.innerText} ${description.innerText} ${tagsCell.innerText}`.toLowerCase();
        shouldHide = !wordsSource.includes(normalizedWords);
      }

      const shouldBeCompleted = type === 'completed';
      const isCompleted = completed.children[0].checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      if (tag !== 'all' && !rowTags.includes(tag)) {
        shouldHide = true;
      }

      if (shouldHide) {
        row.classList.add('d-none');
      } else {
        row.classList.remove('d-none');
      }
    }
  }

  addTodo(title, description, tags) {
    const todo = this.model.addTodo(title, description, tags);
    this.createRow(todo);
    this.refreshTagFilters();
    this.filter(this.currentFilters);
  }

  toggleCompleted(id) {
    this.model.toggleCompleted(id);
  }

  editTodo(id, values) {
    this.model.editTodo(id, values);
    const row = document.getElementById(id);
    row.children[0].innerText = values.title;
    row.children[1].innerText = values.description;
    this.renderTags(row.children[2], values.tags);
    row.dataset.tags = values.tags.join(',');
    row.children[3].children[0].checked = values.completed;
    this.refreshTagFilters();
    this.filter(this.currentFilters);
  }

  removeTodo(id) {
    this.model.removeTodo(id);
    document.getElementById(id).remove();
    this.refreshTagFilters();
    this.filter(this.currentFilters);
  }

  renderTags(cell, tags) {
    cell.innerHTML = '';

    if (!tags || tags.length === 0) {
      cell.innerHTML = '<span class="text-muted">No tags</span>';
      return;
    }

    tags.forEach((tag) => {
      const badge = document.createElement('span');
      badge.classList.add('badge', 'badge-info', 'mr-1');
      badge.innerText = tag;
      cell.appendChild(badge);
    });
  }

  createRow(todo) {
    const row = this.table.insertRow();
    row.setAttribute('id', todo.id);
    row.dataset.tags = (todo.tags || []).join(',');
    row.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.description}</td>
      <td></td>
      <td class="text-center">

      </td>
      <td class="text-right">

      </td>
    `;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onclick = () => this.toggleCompleted(todo.id);
    row.children[3].appendChild(checkbox);

    this.renderTags(row.children[2], todo.tags || []);

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'mb-1');
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => this.modal.setValues({
      id: todo.id,
      title: row.children[0].innerText,
      description: row.children[1].innerText,
      tags: (row.dataset.tags || '').split(',').filter((value) => value !== ''),
      completed: row.children[3].children[0].checked,
    });
    row.children[4].appendChild(editBtn);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => this.removeTodo(todo.id);
    row.children[4].appendChild(removeBtn);
  }
}
