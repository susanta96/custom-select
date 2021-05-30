export default class SelectClass {
  constructor(el) {
    this.el = el;
    this.options = getFormattedOptions(el.querySelectorAll('option'))
    this.customEl = document.createElement('div')
    this.labelEl = document.createElement('span')
    this.optCustomEl = document.createElement('ul')
    setupCustomEl(this);
    el.style.display = 'none'
    el.style.visibility = 'hidden'
    el.style.position = 'absolute';
    el.style.width = '1px';
    el.style.height = '1px';
    el.after(this.customEl);
  }

  get selectedOption() {
    return this.options.find(opt => opt.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption)
  }

  selectValue(value) {
    const newSelectedOption = this.options.find(opt => opt.value === value)
    const prevSelectedOption = this.selectedOption
    prevSelectedOption.selected = false
    prevSelectedOption.element.selected = false

    newSelectedOption.selected = true
    newSelectedOption.element.selected = true

    this.labelEl.innerText = newSelectedOption.label

    this.optCustomEl.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected')
    const newCustomEl = this.optCustomEl.querySelector(`[data-value="${newSelectedOption.value}"]`)
    newCustomEl.classList.add('selected')
    newCustomEl.scrollIntoView({block: 'nearest'})

  }

}

function setupCustomEl(select) {
  select.customEl.classList.add('cs-container')
  select.customEl.tabIndex = 0
  select.labelEl.classList.add('cs-value')
  select.labelEl.innerText = select.selectedOption.label
  select.customEl.append(select.labelEl);

  select.optCustomEl.classList.add('cs-options')
  select.options.forEach(opt => {
    const optionEl = document.createElement('li')
    optionEl.classList.add('cs-option')
    optionEl.classList.toggle('selected', opt.selected)
    optionEl.innerText = opt.label
    optionEl.dataset.value = opt.value
    optionEl.addEventListener('click', () =>{
      select.selectValue(opt.value)
      select.optCustomEl.classList.remove('show');
    })
    select.optCustomEl.append(optionEl);
  })
  select.customEl.append(select.optCustomEl)

  select.labelEl.addEventListener('click', () => {
    select.optCustomEl.classList.toggle('show');
  })

  select.customEl.addEventListener('blur', () => {
    select.optCustomEl.classList.remove('show');
  })

  let debounceTimeout
  let searchText = ''
  select.customEl.addEventListener('keydown', (e) => {
    switch(e.code){
      case "Space": 
        select.optCustomEl.classList.toggle('show');
        break;
      case "ArrowUp": {
        const prevOption = select.options[select.selectedOptionIndex - 1]
        if(prevOption){
          select.selectValue(prevOption.value);
        }
        break;

      }
      case "ArrowDown": {
        const nextOption = select.options[select.selectedOptionIndex + 1]
        if(nextOption){
          select.selectValue(nextOption.value);
        }
        break;

      }
      case "Enter":
      case "Escape":
        select.optCustomEl.classList.remove('show')
        break;
      default: {
        clearTimeout(debounceTimeout)
        searchText += e.key
        debounceTimeout = setTimeout(() => {
          searchText = '';
        }, 500)

        const searchOption = select.options.find(option => option.label.toLowerCase().startsWith(searchText))
        if(searchOption) select.selectValue(searchOption.value)
      }
    }
  })

}

function getFormattedOptions(optionsEl) {
  return [...optionsEl].map(optEl => {
    return {
      value: optEl.value,
      label: optEl.label,
      selected: optEl.selected,
      element: optEl
    }
  })
}