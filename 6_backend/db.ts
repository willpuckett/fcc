import { collection, kvdex } from 'jsr:@olli/kvdex'
import { z } from 'npm:zod'

export const kv = await Deno.openKv()

export const ExerciseSchema = z.object({
  description: z.string(),
  duration: z.coerce.number().positive(),
  date: z.string().transform((v) => (new Date(v)).toDateString()).default(() =>
    (new Date()).toDateString()
  ),
})

export const UserSchema = z.object({
  username: z.string(),
  count: z.number().default(0),
  log: z.array(ExerciseSchema).default([]),
})

export type User = z.infer<typeof UserSchema>
// export type Exercise = z.infer<typeof ExerciseSchema>

export const db = kvdex(kv, {
  users: collection(UserSchema, {
    // history: true,
    indices: {
      'username': 'primary', // unique
      // age: "secondary" // non-unique
    },
  }),
})
