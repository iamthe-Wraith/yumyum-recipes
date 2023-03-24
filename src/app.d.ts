// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { users } from "@prisma/client";

declare global {
  namespace App {
    interface Locals {
      user?: users
    }
  }
}
 
export {};
