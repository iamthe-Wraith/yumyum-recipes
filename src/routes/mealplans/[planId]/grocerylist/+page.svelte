<script lang="ts">
  import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import Page from "$lib/components/Page.svelte";
  import { GroceryListItemStatus, type IGroceryListItem } from "$types/models";
  import type { PageData } from "./$types";

  export let data: PageData;
  
  let activeItems: IGroceryListItem[] = [];
  let inactiveItems: IGroceryListItem[] = [];

  $: if (data.groceryList?.items?.length) {
    activeItems = [];
    inactiveItems = [];

    for (const item of data.groceryList.items) {
      if (item.status === GroceryListItemStatus.ACTIVE) {
        activeItems.push(item);
      } else {
        inactiveItems.push(item);
      }
    }
  }
</script>

<Page>
  <h1>Grocery List</h1>
  {#if data.groceryList?.items?.length}
    <div class="list-container">
      <p>
        {activeItems.length}/{data.groceryList.items.length} Items Remaining
      </p>
      <ul>
        {#each activeItems as item}
          <li>
            <form
              id={`form-${item.id}`}
              method="POST" 
              action={`?/updateGroceryListItemStatus`}
              use:enhance
            >
              <input type="hidden" name="listId" value={data.groceryList.id} />
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="status" value={GroceryListItemStatus.INACTIVE} />

              <Button type="submit" kind='primary'>
                Got it
              </Button>

              <span class="item-text">
                <!-- if the unit is not set, it means the amount is a count rather than some kind of measurement -->
                {`${item.amount?.amount}${item.amount?.unit ? `${item.amount?.unit}` : 'x'} ${item.name}`}
              </span>
            </form>
          </li>
        {/each}

        {#each inactiveItems as item}
          <li>
            <form
              id={`form-${item.id}`}
              method="POST" 
              action={`?/updateGroceryListItemStatus`}
              use:enhance
            >
              <input type="hidden" name="listId" value={data.groceryList.id} />
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="status" value={GroceryListItemStatus.ACTIVE} />

              <Button type="submit" kind='secondary'>
                Undo
              </Button>

              <span class="item-text inactive">
                <!-- if the unit is not set, it means the amount is a count rather than some kind of measurement -->
                {`${item.amount?.amount}${item.amount?.unit ? `${item.amount?.unit}` : 'x'} ${item.name}`}
              </span>
            </form>
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

    form {
      button {
        margin: 0;
        padding: 0;
        background: none;
        border: none;
      }

      .item-text {
        margin-left: 1rem;

        &.inactive {
          text-decoration: line-through;
          color: var(--neutral-500);
        }
      }
    }
  }

  .no-items {
    padding: 3rem 0 1rem;

    p {
      color: var(--neutral-500);
    }
  }
</style>