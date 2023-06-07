import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ user }) => user))