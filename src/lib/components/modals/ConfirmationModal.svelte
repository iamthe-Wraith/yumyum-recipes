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
	import LoadingBasic from "../processing-anims/LoadingBasic.svelte";

  export let isOpen = true;
  export let title: string;
  export let message: string;
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
  export let processing: boolean = false;

  const dispatch = createEventDispatcher();

  function onClose() {
    dispatch('close');
  }

	function onConfirm() {
		dispatch('confirm');
	}

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

{#if isOpen}
  <div transition:fade>
    <Dialog
      on:close={onClose}
      open={isOpen} 
      style={modalStyles}
      class="dialog"
      static
    >
      <DialogOverlay style={overlayStyles} />

      <div class="modal-outer {appearance}">
        <div class="modal">
          <DialogTitle>{title}</DialogTitle>
          
          <div class="message-container">
            <DialogDescription>{message}</DialogDescription>
          </div>
        
          <div class="buttons-container">
            <slot name="confirm">
              {#if processing}
                <LoadingBasic />
              {:else}
                <Button on:click={onConfirm}>Confirm</Button>
              {/if}
            </slot>
            <slot name="cancel">
              {#if !processing}
                <Button kind="transparent" on:click={onClose}>Cancel</Button>
              {/if}
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
    z-index: 10;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3), 0 0 15px 0 rgba(0, 0, 0, 0.2);

    &.primary-tertiary {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--tertiary-300) 100%);
    }
    
    &.secondary-primary {
      background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-400) 100%);
    }
    
    &.tertiary-secondary {
      background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);
    }
  }

  .modal {
    display: flex;
    flex-direction: column;
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
