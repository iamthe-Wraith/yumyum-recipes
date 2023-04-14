<div />

<style lang="scss">
  div {
    position: relative;
    width: 100%;
    height: 100%;

    @keyframes spin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    &:before {
      content: ' ';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1rem;
      height: 1rem;
      border-top: 2px solid var(--primary-500);
      border-right: 2px solid transparent;
      border-bottom: 2px solid transparent;
      border-left: 2px solid transparent;
      border-radius: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
      animation: spin 1s linear infinite;
    }
  }
</style>