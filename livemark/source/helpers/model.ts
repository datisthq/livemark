import { z } from "zod"

/** Zod schema for a non-empty string (rejects ""). */
export const nonEmptyString = z.string().min(1)
