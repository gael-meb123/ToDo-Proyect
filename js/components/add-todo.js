import Alert from './alert.js';

export default class AddTodo {
  constructor() {
    this.btn = document.getElementById('add');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');
    this.tags = document.getElementById('tags');

    this.alert = new Alert('alert');
    hola mundo23
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
      if (this.title.value === '' || this.description.value === '') {
        this.alert.show('Title and description are required');
      } else {
        this.alert.hide();
        callback(this.title.value, this.description.value, this.parseTags(this.tags.value));
        this.title.value = '';
        this.description.value = '';
        this.tags.value = '';
      }
    }
  }
}
