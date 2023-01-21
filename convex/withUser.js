/**
 * Wrapper for Convex query or mutation functions that provides a user.
 * @author Ian Macartney
 * @see https://stack.convex.dev/wrappers-as-middleware-authentication
 * @param - func Your function that can now take in a `user` in the ctx.
 * @returns A function to be passed to `query` or `mutation`.
 */
export default function withUser(func) {
    return async (ctx, ...args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error(
                'Unauthenticated call to a function requiring authentication'
            );
        }
        // Note: If you don't want to define an index right away, you can use
        // db.query("users")
        //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
        //  .unique();
        const user = await ctx.db
            .query('users')
            .withIndex('by_token', (q) =>
                q.eq('tokenIdentifier', identity.tokenIdentifier)
            )
            .unique();
        if (!user) throw new Error('User not found');
        return await func({ ...ctx, user }, ...args);
    };
};