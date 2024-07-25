import {v} from "convex/values"
import {mutation, query} from "./_generated/server"
import {Simulate} from "react-dom/test-utils";
import {initialEnv} from "@next/env";
import arg from "arg";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
  "/placeholders/11.svg",
  "/placeholders/12.svg",
  "/placeholders/13.svg",
  "/placeholders/14.svg",
  "/placeholders/15.svg",
  "/placeholders/16.svg",
  "/placeholders/17.svg",
  "/placeholders/18.svg",
  "/placeholders/19.svg",
  "/placeholders/20.svg",
]

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("未经授权")
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
  }
})

export const remove = mutation({
  args: {id: v.id("boards")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("没有权限");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id)
    }

    await ctx.db.delete(args.id);
  }
})

export const updata = mutation({
  args: {id: v.id("boards"), title: v.string()},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("没有权限")
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("重命名成功");
    }

    if (title.length > 60) {
      throw new Error("名称长度不能大于60字符")
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  }
})

export const favorite = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("没有权限");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("找不到画板")
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("已是星标，无需在添加");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  }
})

export const unFavorite = mutation({
  args: {id: v.id("boards")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("没有权限");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("找不到画板")
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("未找到指定的画板");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  }
})

export const get = query({
  args: {id: v.id("boards")},
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id)

    return board;
  }
})
