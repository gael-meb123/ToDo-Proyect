export default class Filters {
  constructor() {
    this.form = document.getElementById('filters');
    this.btn = document.getElementById('search');
    this.tagSelect = document.getElementById('filter-tag');

    const allFilter = this.form.querySelector('input[name="type"][value="all"]');
    if (allFilter) {
      allFilter.checked = true;
    }
  }

  setTagOptions(tags, selectedTag = 'all') {
    this.tagSelect.innerHTML = '<option value="all">All tags</option>';
    tags.forEach((tag) => {
      const option = document.createElement('option');
      option.value = tag;
      option.innerText = tag;
      this.tagSelect.appendChild(option);
    });

    const hasSelectedTag = tags.includes(selectedTag) || selectedTag === 'all';
    this.tagSelect.value = hasSelectedTag ? selectedTag : 'all';
  }

  onClick(callback) {
    this.btn.onclick = (e) => {
      e.preventDefault();
      const data = new FormData(this.form);
      callback({
        type: data.get('type'),
        words: data.get('words'),
        tag: data.get('tag'),
      });
    }
  }
}
