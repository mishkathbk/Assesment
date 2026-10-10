# Lead Manager

A CRM dashboard for managing sales leads, built with Next.js and TypeScript on top of the [ReqRes](https://reqres.in) API.

## Features

- Loads leads from `GET /api/users?page=1`, with a refresh button to fetch them again
- Adds a lead with `POST /api/users`
- Edits all details of a lead with `PUT /api/users/{id}`. The form is filled in with the current values
- Edits only the job title, inline in the list, with `PATCH /api/users/{id}`
- Deletes a lead with `DELETE /api/users/{id}` after a confirmation step
- Validates fields when you leave them and when you submit
- Shows loading states, blocks double submits, and confirms every request with a success or error message
- Searches by name, email or job title
- Keeps the current page in the URL (`?page=2`), so refreshing stays on the same page
- Works on mobile and desktop

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form + Zod, Framer Motion, React Toastify, Lucide icons

## Running locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://reqres.in/api` |
| `NEXT_PUBLIC_API_KEY` | ReqRes API key, sent as the `x-api-key` header |

## Folder structure

```
app/
  api/          Axios instance and lead requests
  components/   Dashboard and reusable UI components
  lib/          Helpers, constants and validation
  types/        TypeScript types
  page.tsx      Home page
```

## About the data

ReqRes is a mock API. It accepts every request but doesn't save anything, so refreshing brings back the original list. Changes are kept in the app until you press Refresh or reload the page. ReqRes users don't have a job title, so loaded leads start without one and you can add it from the list.
