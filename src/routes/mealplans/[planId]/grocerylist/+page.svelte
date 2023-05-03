<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
import Page from "$lib/components/Page.svelte";
	import { GroceryListItemStatus } from "$types/models";
	import type { PageData } from "./$types";

  export let data: PageData;
  
  let itemsRemaining = 0;

  $: itemsRemaining = data.groceryList?.items?.filter((item) => item.status === GroceryListItemStatus.ACTIVE).length || 0;
</script>

<Page>
  <h1>Grocery List</h1>
  {#if data.groceryList?.items?.length}
    <div class="list-container">
      <p>
        {itemsRemaining}/{data.groceryList.items.length} Items Remaining
      </p>
      <ul>
        {#each data.groceryList.items as item}
          <li>
            <!-- TODO: wrap in form to update item status -->
            <Checkbox
              id={item.id.toString()}
              name='status'
              text={`${item.amount?.amount}${item.amount?.unit ? ` ${item.amount?.unit}` : 'x'} ${item.name}`}
              checked={item.status === GroceryListItemStatus.INACTIVE}
              appearance="tertiary-secondary"
            />
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="no-items">
      <p>No items found.</p>
    </div>
  {/if}
</Page>

<style lang="scss">
  .list-container {
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;
    padding: 1rem 0;
  }

  p {
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  .no-items {
    padding: 3rem 0 1rem;

    p {
      color: var(--neutral-500);
    }
  }
</style>