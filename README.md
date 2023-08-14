# YumYum Recipes

[yumyum.jakelundberg.dev](https://yumyum.jakelundberg.dev)

YumYum is a meal planning app that let's users create and share recipes, and plan meals for the week.

Because of how much of a chore it is to plan meals, I wanted a simple way to fill a week with meals and generate a shopping list. We were already keeping a "cookbook" of our favorite meals, but it was still a hassle picking what meals we wanted, then making a shopping list (and hoping we didn't miss or forget anything), and then checking if we already had some of the items.

With YumYum, you can pick meals from your existing cookbook...OR if you don't feel like picking, just click 1 button and let the app pick meals for you. Once you have your meals, you can generate a shopping list, consolidating all the ingredients you need for the week based on the number of people you need to feed. No more manually calculating how much of each ingredient you need because the recipe serves 4, but you need to feed 6. YumYum does it for you.

Once you have your grocery list, you can check off items as you shop, and YumYum will keep track of what you've already bought. No more wondering where you wrote down your list. YumYum stores it for you and makes it easy to access from your phone.

When it's time to cook, just pull up the recipe on your phone or tablet and follow along. No more printing out recipes or trying to keep your laptop clean while you cook.

-----

## The Technicals

YumYum is a full-stack web application built with the following technologies:
- SvelteKit
- TypeScript
- Postgres
- Prisma

Like most of my applications, I host YumYum on [Render](https://render.com).

### Why SvelteKit
I had been wanting to learn more about Svelte and SvelteKit for a while, and since this was a personal project, originally just to help my spouse and I plan meals, I figured it was a good opportunity to learn something new.

Throughout this project I fell in love with Svelte and SvelteKit and I'm excited to use it for future projects.

### Why TypeScript
I've been using Typescript for a while now, and I honestly couldn't tell you the last time I worked on a project without it. I find tremendous value in the type safety and intellisense it provides, especially when working on teams. I've found that it helps me write better code, and to catch errors before they happen.

### Why Postgres and Prisma
I had been using MongoDB for a long time, and while it's great for many things, I knew I was going to need to do some relational data modeling for this project, so I decided to dive back into the workd of relational databases. I had heard about Postgres for a long time, but never really had a reason to use it, so I took this opportunity to learn more about it. I'm glad I did! I really liked working with Postgres and Prisma. The automatically generated types and queries were a huge time saver, and I found the Prisma documentation to be very helpful.

-----

## Resources

| resource | url |
| :-- | :-- |
| icons | https://ionic.io/ionicons |
