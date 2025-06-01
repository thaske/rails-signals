import { A, useNavigate, useParams } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { apiRequest } from "../../utils/api";
import { useFlash } from "../../utils/flash";
import CommentForm from "../comments/CommentForm";
import CommentsList from "../comments/CommentsList";
import "../common.scss";
import "./PostShow.scss";

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    name: string;
  };
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  user_name: string;
  created_at: string;
}

interface PostWithComments {
  post: Post;
  comments: Comment[];
}

export default function PostShow() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addFlash } = useFlash();

  const postQuery = useQuery(() => ({
    queryKey: ["posts", params.id],
    queryFn: async (): Promise<PostWithComments> => {
      const response = await apiRequest(`/posts/${params.id}.json`);
      return response.json();
    },
    enabled: !!params.id,
  }));

  const deletePostMutation = useMutation(() => ({
    mutationFn: async (postId: number) => {
      await apiRequest(`/posts/${postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      addFlash("Post deleted successfully!", "success");
      navigate("/");
    },
    onError: () => {
      addFlash("Failed to delete post. Please try again.", "error");
    },
  }));

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(parseInt(params.id));
    }
  };

  return (
    <Switch>
      <Match when={postQuery.isPending}>
        <div class="loading-message">Loading...</div>
      </Match>
      <Match when={postQuery.isError}>
        <div class="error-message">
          Error loading post: {postQuery.error?.message}
        </div>
      </Match>
      <Match when={postQuery.isSuccess && postQuery.data}>
        {(() => {
          const data = postQuery.data!;
          return (
            <div class="post-detail">
              <nav class="breadcrumb">
                <A href="/" class="breadcrumb__link">
                  ← Back to Feed
                </A>
              </nav>

              <article class="post">
                <header class="post__header">
                  <h1 class="post__title">{data.post.title}</h1>
                  <div class="post__meta">
                    <div>
                      <span class="post__author">by {data.post.user.name}</span>
                      <span class="post__date">
                        {new Date(data.post.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div class="post__actions">
                      <A
                        href={`/posts/${data.post.id}/edit`}
                        class="button button--secondary button--small"
                      >
                        Edit
                      </A>
                      <button
                        class="button button--danger button--small"
                        onClick={handleDeletePost}
                        disabled={deletePostMutation.isPending}
                      >
                        {deletePostMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </header>

                <div class="post__content">
                  <For each={data.post.content.split("\n")}>
                    {(paragraph) => <p>{paragraph}</p>}
                  </For>
                </div>

                <footer class="post__footer">
                  <div class="comments-section">
                    <h2>Comments ({data.comments.length})</h2>

                    <CommentForm postId={data.post.id} />

                    <CommentsList
                      comments={data.comments}
                      postId={data.post.id}
                    />
                  </div>
                </footer>
              </article>
            </div>
          );
        })()}
      </Match>
    </Switch>
  );
}
