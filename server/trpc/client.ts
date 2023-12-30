import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "."
//main file (initialized trpc with appRouter from index.ts)
export const trpc = createTRPCReact<AppRouter>({})
