# Lead Manager

A small dashboard to view, add, edit and delete sales leads. Built with Next.js and TypeScript, using the [ReqRes](https://reqres.in) API as the backend.

## Features

- Paginated lead list, with the current page kept in the URL (`?page=2`)
- Add and edit leads in a modal form with validation
- Edit the job title directly in the list
- Delete with a confirmation dialog
- Search the current page by name, email or job title
- Loading, empty and error states, plus toast messages for every action
- Responsive layout for mobile and desktop

## Tech stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Axios
- React Hook Form and Zod
- Framer Motion
- React Toastify
- Lucide icons

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Name | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API base URL, `https://reqres.in/api` |
| `NEXT_PUBLIC_API_KEY` | ReqRes API key, sent in the `x-api-key` header |

The demo key in `.env.example` is limited to 40 requests per day per IP. For more, create a free account on ReqRes and use your own key.

## API

| Action | Method | Endpoint | Success status |
| --- | --- | --- | --- |
| List leads | `GET` | `/users?page={page}` | `200 OK` |
| Add lead | `POST` | `/users` | `201 Created` |
| Update lead | `PUT` | `/users/{id}` | `200 OK` |
| Update job title | `PATCH` | `/users/{id}` | `200 OK` |
| Delete lead | `DELETE` | `/users/{id}` | `204 No Content` |

Error handling:

| Status | Message shown |
| --- | --- |
| `429 Too Many Requests` | Daily request limit reached |
| Timeout (10s) | The request took too long |
| No response | Unable to reach the server |
| Other errors | The message returned by the API |

## Project structure

```
app/
  api/          Axios instance and API calls
  components/   UI components
  lib/          Constants, helpers and validation
  types/        TypeScript types
  layout.tsx    Root layout with header and toasts
  page.tsx      Home page
```

## Notes

ReqRes is a mock API. Create, update and delete requests return a success response, but nothing is saved on the server. The app updates the list locally after each request, so changes stay visible until you press Refresh or reload the page.

ReqRes users don't have a job title, so leads loaded from the API start without one.
