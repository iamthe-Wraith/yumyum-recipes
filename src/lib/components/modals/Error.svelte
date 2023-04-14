<script lang="ts">
  import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from "@rgossiaux/svelte-headlessui";
	import Button from "../Button.svelte";
	import { AppError } from "$lib/stores/error";

  const baseStyles = `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
  `;

  const overlayStyles = ` 
    ${baseStyles}
    background-color: rgb(0 0 0); 
    opacity: 0.3;
    z-index: 9;
  `;

  const modalStyles = `
    ${baseStyles}
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `;
</script>

{#if $AppError?.message}
  <div transition:fade>
    <Dialog
      on:close={() => AppError.clear()}
      open={!!$AppError?.message} 
      style={modalStyles}
      class="dialog"
      static
    >
      <DialogOverlay style={overlayStyles} />

      <div class="modal-outer">
        <div class="modal">
          <DialogTitle>{$AppError.title || 'Error'}</DialogTitle>
          
          <div class="message-container">
            <DialogDescription>{$AppError.message}</DialogDescription>
          </div>
        
          <div class="buttons-container">
            <slot name="okay">
              <Button kind="danger" on:click={() => AppError.clear()}>Okay</Button>
            </slot>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
{/if}

<style lang="scss">
  .modal-outer {
    position: relative;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: var(--danger-500);
    z-index: 10;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3), 0 0 15px 0 rgba(0, 0, 0, 0.2);
  }

  .modal {
    display: flex;
    flex-direction: column;
    min-width: 25rem;
    max-width: 50rem;
    padding: 1rem;
    background: var(--neutral-100);
    border-radius: 0.5rem;
  }

  .message-container {
    margin: 1rem;
  }

  .buttons-container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    margin-top: 1rem;

    --button-margin-left: 1rem;
  }
</style>
