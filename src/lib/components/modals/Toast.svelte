<script lang="ts">
  import { fly } from "svelte/transition";
  import { Toast } from "$lib/stores/toast";
  import IconButton from "../IconButton.svelte";
  import XIcon from "$lib/icons/XIcon.svelte";
</script>

{#if !!$Toast.length}
  <div
    class="modal-outer {$Toast[0].type || 'success'}"
    in:fly={{ x: 0, y: -50 }}
    out:fly={{ x: 0, y: -50 }}
  >
    <div class="modal">
      <span>{$Toast[0].message}</span>
      
      {#if $Toast[0].redirect}
        <a href={$Toast[0].redirect.url}>
          {$Toast[0].redirect.text}
        </a>
      {/if}

      <IconButton
        kind={$Toast[0].type === 'error' ? 'danger' : 'neutral'}
        on:click={() => Toast.remove()}
      >
        <XIcon />
      </IconButton>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-outer {
    position: fixed;
    top: 5rem;
    left: 50%;
    padding: 0.2rem;
    border-radius: 0.5rem;
    z-index: 100;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3), 0 0 15px 0 rgba(0, 0, 0, 0.2);
    transform: translateX(-50%);

    &.success {
      --icon-color: var(--neutral-900);

      background: var(--primary-500);

      a {
        color: var(--secondary-500)
      }
    }

    &.error {
      --icon-color: var(--danger-800);
      
      background: var(--danger-500);

      a {
        color: var(--danger-500)
      }
    }
  }

  .modal {
    --icon-button-margin-left: 1.5rem;
    --icon-size: 0.75rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    background: var(--neutral-100);
    border-radius: 0.5rem;

    a {
      margin: 0 0.5rem;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
