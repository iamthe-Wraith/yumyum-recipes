<script lang="ts">
  /**
   * this dropdown will work regardless if javascript is enabled or not.
   * 
   * if enabled, will use the custom styled dropdown. if disabled, will
   * fallback to the native select element...though the design will be
   * broken.
   * 
   * the custom dropdown was inspired by:
   * https://dev.to/emmabostian/creating-a-custom-accessible-drop-down-3gmo
  */

	import { onMount } from "svelte";
	import { noop } from "$lib/helpers/noop";
	import type { IDropdownOption } from "$types/dropdown";

  export let id: string;
  export let name: string;
  export let label: string;
  export let onChange: (option: IDropdownOption) => void = noop;
  export let options: IDropdownOption[];

  let selected: IDropdownOption = options.find((option) => option.selected) || options[0];
  let highlighted: number | null = null;

  $: selected = options.find((option) => option.selected) || options[0];

  let dropdownLabel: HTMLLabelElement;
  let dropdownInput: HTMLInputElement;
  let dropdownSelected: HTMLLIElement;
  let dropdownListContainer: HTMLLIElement;
  let dropdownList: HTMLUListElement;
  let dropdownArrow: SVGSVGElement;
  let dropdownOptions: HTMLLIElement[];

  onMount(() => {
    const dropdown = document.getElementById(id);
    if (dropdown) dropdown.classList.remove('disabled');

    dropdownOptions = Array.from(dropdownList.querySelectorAll('.dropdown-option'));

    dropdownInput = document.createElement('input');
    dropdownInput.type = 'hidden';
    dropdownInput.name = name;
    dropdownInput.value = selected.value;
    dropdownLabel.after(dropdownInput);
  })

  function closeList() {
    dropdownListContainer.classList.remove("open");
    dropdownListContainer.setAttribute("aria-expanded", "false");
    dropdownArrow.classList.remove("expanded");
    highlighted = null;
    dropdownSelected.focus();
  }

  function focusNextListItem(dir: 'ArrowUp' | 'ArrowDown') {
    switch (dir) {
      case 'ArrowUp': {
        if (highlighted === null || highlighted <= 0) return;
        console.log('arrow up', highlighted);
        highlighted -= 1;
        dropdownOptions[highlighted].focus();
        break;
      }
      case 'ArrowDown': {
        if (highlighted !== null && highlighted >= dropdownOptions.length - 1) return;
        highlighted = highlighted === null ? 0 : highlighted + 1;
        dropdownOptions[highlighted].focus();
        break;
      }
      default: return;
    }
  }

  function onOptionEngaged (e: KeyboardEvent | MouseEvent) {
    if ((e as KeyboardEvent).key === 'Escape') return closeList();

    if (e.type === 'click' || (e as KeyboardEvent).key === 'Enter') {
      setSelectedListItem(e);
      closeList();
    }

    if ((e as KeyboardEvent).key === 'ArrowUp' || (e as KeyboardEvent).key === 'ArrowDown') {
      focusNextListItem((e as KeyboardEvent).key as 'ArrowUp' | 'ArrowDown');
    }
  }

  function onTriggerEngaged(e: KeyboardEvent | MouseEvent) {
    if ((e as KeyboardEvent).key === 'Escape') return closeList();

    const openDropdown = (e as KeyboardEvent).key === ' ' || (e as KeyboardEvent).key === 'Enter';

    if (e.type === 'click' || openDropdown) {
      dropdownListContainer.classList.toggle('open');
      dropdownListContainer.setAttribute("aria-expanded", dropdownList.classList.contains("open").toString());
      dropdownArrow.classList.toggle("expanded");
    }

    if ((e as KeyboardEvent).key === 'ArrowUp' || (e as KeyboardEvent).key === 'ArrowDown') {
      e.preventDefault();
      focusNextListItem((e as KeyboardEvent).key as 'ArrowUp' | 'ArrowDown');
    }
  }

  function setSelectedListItem(e: KeyboardEvent | MouseEvent) {
    if ((e.type !== 'click' && (e as KeyboardEvent).key !== 'Enter') || e.target === null) return;
    selected = options.find((option) => option.value === (e.target as HTMLLIElement).dataset.value) || options[0];
    dropdownInput.value = selected.value;
    onChange(selected);
  }
</script>

<div class="dropdown-container">
  <label for={id} id="dropdown-label" bind:this={dropdownLabel}>{label}</label>

  <noscript>
    <select
      id={`${id}-noscript`}
      name={name}
    >
      {#each options as option}
        <option
          value={option.value}
          selected={option.selected}
        >
          {option.label}
        </option>
      {/each}
    </select>
  </noscript>

  <ul class="dropdown disabled" id={id}>
    <li
      role="button"
      class="dropdown-selected focusable"
      tabindex="0"
      aria-labelledby="dropdown-label"
      bind:this={dropdownSelected}
      on:click={onTriggerEngaged}
      on:keydown={onTriggerEngaged}
    >
      {selected.label}
    </li>
  
    <svg
      class="dropdown-arrow" 
      width="10" 
      height="5" 
      viewBox="0 0 10 5" 
      fill-rule="evenodd"
      bind:this={dropdownArrow}
    >
      <title>Open drop down</title>
      <path d="M10 0L5 5 0 0z"></path>
    </svg>
  
    <li
      aria-expanded="false"
      role="list"
      class="dropdown-list-container"
      bind:this={dropdownListContainer}
    >
      <ul
        class="dropdown-list"
        bind:this={dropdownList}
      >
        {#each options as option}
          <li
            role="button"
            tabindex="0"
            data-value={option.value}
            class={`dropdown-option ${option.selected ? 'selected' : ''}`}
            on:click|preventDefault={onOptionEngaged}
            on:keydown|preventDefault={onOptionEngaged}
          >
            {option.label}
          </li>
        {/each}
      </ul>
    </li>
  </ul>
</div>

<style lang="scss">
  label {
    margin-bottom: 0.25rem;
  }

  select {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    color: var(--neutral-900);
    background: var(--neutral-200);
    border: 1px solid #000;
    border-radius: 0.25rem;
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
  }

  .dropdown-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: var(--dropdown-margin-top, 0);
    margin-right: var(--dropdown-margin-right, 0);
    margin-bottom: var(--dropdown-margin-bottom, 1rem);
    margin-left: var(--dropdown-margin-left, 0);
  }

  .dropdown {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    list-style: none;

    &.disabled {
      display: none;
    }
  }

  .dropdown-selected {
    width: 100%;
    height: 100%;
    padding: 0.5rem 0.75rem 0.5rem 0.5rem;
    background: #000;
    font-size: 1rem;
    font-weight: 500;
    background: var(--neutral-200);
    color: var(--neutral-900);
    border: 1px solid #000;
    border-radius: 0.25rem;
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .dropdown-arrow {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    width: 0.7rem;
    height: 0.7rem;
    fill: var(--neutral-900);
    transform: translateY(-50%) rotate(0deg);
    pointer-events:none;

    &.expanded {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  .dropdown-list-container {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    display: none;
    width: 100%;
    padding: 0;
    margin: 0;
    background: #000;
    border: 1px solid var(--neutral-500);
    border-radius: 0.25rem;
    overflow: hidden;
    z-index: 10;

    &.open {
      display: block;
    }
  }
  
  .dropdown-list {
    list-style: none;
    overflow: auto;
  }

  .dropdown-option {
    padding: 0.5rem;
    outline: none;
    border: none;

    &:hover,
    &:focus {
      background: var(--neutral-300);
    }

    &:hover {
      cursor: pointer;
    }
  }
</style>