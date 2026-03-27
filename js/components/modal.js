import Alert from './alert.js';

export default class Modal {
  constructor() {
    this.title = document.getElementById('modal-title');
    this.description = document.getElementById('modal-description');
    this.tags = document.getElementById('modal-tags');
    this.btn = document.getElementById('modal-btn');
    this.completed = document.getElementById('modal-completed');
    this.alert = new Alert('modal-alert');

    this.todo = null;
  }

  setValues(todo) {
    this.todo = todo;
    this.title.value = todo.title;
    this.description.value = todo.description;
    this.tags.value = (todo.tags || []).join(', ');
    this.completed.checked = todo.completed;
  }

  parseTags(rawTags) {
    const tags = rawTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    return Array.from(new Set(tags));
  }

  onClick(callback) {
    this.btn.onclick = () => {
      if (!this.title.value || !this.description.value) {
        this.alert.show('Title and description are required');
        return;
      }

      $('#modal').modal('toggle');

      callback(this.todo.id, {
        title: this.title.value,
        description: this.description.value,
        tags: this.parseTags(this.tags.value),
        completed: this.completed.checked,
      });
    }
  }
}
