<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/Button.svelte";
  import Page from "$lib/components/Page.svelte";
  import ConfirmationModal from "$lib/components/modals/ConfirmationModal.svelte";
  import LoadingBasic from "$lib/components/processing-anims/LoadingBasic.svelte";
  import { Toast } from "$lib/stores/toast";
  import { GroceryListItemStatus, GroceryListStatus, type IGroceryListItem } from "$types/models";
  import type { PageData } from "./$types";

  export let data: PageData;

  let activeItems: IGroceryListItem[] = [];
  let inactiveItems: IGroceryListItem[] = [];
  let confirmListCompletion = false;
  let markingListAsComplete = false;

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

  const getFirstActiveItem = (items: IGroceryListItem[]) => {
    return (items || []).find(item => item.status === GroceryListItemStatus.ACTIVE);
  }
</script>

<Page>
  <h1>Grocery List</h1>
  {#if data.groceryList.status === GroceryListStatus.INACTIVE}
    <div class="list-status">Complete</div>
  {/if}
  {#if data.groceryList?.items?.length}
    <div class="list-container">
      <p>
        {activeItems.length}/{data.groceryList.items.length} Items Remaining
      </p>
      <ul>
        {#each activeItems as item}
          <li>
            <form
              method="POST" 
              action={`?/updateGroceryListItemStatus`}
              use:enhance={() => {
                return ({ result, update }) => {
                  if (result.type === 'success') {
                    const firstActiveItem = getFirstActiveItem(result.data?.groceryList?.items)
                    if (!firstActiveItem && data.groceryList.status === GroceryListStatus.ACTIVE) {
                      confirmListCompletion = true;
                    }
                  }

                  if (result.type === 'failure') {
                    Toast.add({ message: result.data?.message || 'Something went wrong. Please try again.' });
                  }

                  update();
                }
              }}
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
              method="POST" 
              action={`?/updateGroceryListItemStatus`}
              use:enhance={() => {
                return ({ result, update }) => {
                  if (result.type === 'failure') {
                    Toast.add({ message: result.data?.message || 'Something went wrong. Please try again.' });
                  }

                  update();
                }
              }}
            >
              <input type="hidden" name="listId" value={data.groceryList.id} />
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="status" value={GroceryListItemStatus.ACTIVE} />

              {#if data.groceryList.status === GroceryListStatus.ACTIVE}
                <Button type="submit" kind='secondary'>
                  Undo
                </Button>
              {/if}

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

  <ConfirmationModal
    isOpen={confirmListCompletion}
    title="All Done?"
    message="It looks like you've got all your grocery list items. Would you like to mark this grocery list as complete?"
    appearance="secondary-primary"
    processing={markingListAsComplete}
    on:close={() => confirmListCompletion = false}
  >
    <form 
      slot="confirm"
      method="POST" 
      action={`?/completeGroceryList`}
      use:enhance={() => {
        markingListAsComplete = true;

        return ({ update }) => {
          markingListAsComplete = false;
          confirmListCompletion = false;

          update();
        }
      }}
    >
      {#if markingListAsComplete}
        <div class="loading-wrapper">
          <LoadingBasic />
        </div>
      {:else}
        <Button>
          Yes, mark as complete
        </Button>
      {/if}
    </form>
  </ConfirmationModal>
</Page>

<style lang="scss">
  .list-container {
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .list-status {
    width: 100%;
    max-width: 20rem;
    margin: 1rem auto 0;
    padding: 0.5rem 1rem;
    background: var(--secondary-100);
    border-radius: 0.25rem;
    text-align: center;
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