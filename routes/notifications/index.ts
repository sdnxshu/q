import { Hono } from "hono"

import { gold } from "./gold"

export const notifications = new Hono()

notifications.route("/gold", gold)
