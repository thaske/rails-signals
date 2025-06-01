import { A } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { apiRequest } from "../../utils/api";
import "../common.scss";
import "./PostsList.scss";

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    name: string;
  };
  created_at: string;
  comments_count: number;
}

export default function PostsList() {
  const postsQuery = useQuery(() => ({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      const response = await apiRequest("/posts.json");
      return response.json();
    },
  }));

  return (
    <div class="posts-index">
      <div class="page-header">
        <h1 class="page-header__title">Feed</h1>
        <A href="/posts/new" class="button button--primary button--normal">
          New Post
        </A>
      </div>

      <Switch>
        <Match when={postsQuery.isPending}>
          <div class="loading-message">Loading...</div>
        </Match>
        <Match when={postsQuery.isError}>
          <div class="error-message">
            Error loading posts: {postsQuery.error?.message}
          </div>
        </Match>
        <Match when={postsQuery.isSuccess}>
          <div class="posts-grid">
            <For
              each={postsQuery.data}
              fallback={
                <div class="no-posts">
                  No posts yet. Be the first to share something!
                </div>
              }
            >
              {(post) => (
                <article class="post-card">
                  <header class="post-card__header">
                    <h2 class="post-card__title">
                      <A href={`/posts/${post.id}`}>{post.title}</A>
                    </h2>
                    <div class="post-card__meta">
                      <span class="post-card__author">by {post.user.name}</span>
                      <span class="post-card__date">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </header>
                  <div class="post-card__content">
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 && "..."}
                  </div>
                  <footer class="post-card__footer">
                    <span class="post-card__comments-count">
                      {post.comments_count} comments
                    </span>
                  </footer>
                </article>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
