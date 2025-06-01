import { A, useNavigate, useParams } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { apiRequest } from "../../utils/api";
import { useFlash } from "../../utils/flash";
import "../common.scss";
import "./PostEdit.scss";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostWithComments {
  post: Post;
}

export default function PostEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addFlash } = useFlash();
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [errors, setErrors] = createSignal<string[]>([]);

  const postQuery = useQuery(() => ({
    queryKey: ["posts", params.id],
    queryFn: async (): Promise<PostWithComments> => {
      const response = await apiRequest(`/posts/${params.id}.json`);
      return response.json();
    },
    enabled: !!params.id,
  }));

  const updatePostMutation = useMutation(() => ({
    mutationFn: async ({
      postId,
      postData,
    }: {
      postId: number;
      postData: { title: string; content: string };
    }) => {
      const response = await apiRequest(`/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({ post: postData }),
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", variables.postId] });
      addFlash("Post updated successfully!", "success");
      navigate(`/posts/${variables.postId}`);
    },
    onError: () => {
      setErrors(["Failed to update post. Please try again."]);
    },
  }));

  // Initialize form when post data loads
  if (postQuery.isSuccess && postQuery.data && !title() && !content()) {
    setTitle(postQuery.data.post.title);
    setContent(postQuery.data.post.content);
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setErrors([]);

    updatePostMutation.mutate({
      postId: parseInt(params.id),
      postData: {
        title: title(),
        content: content(),
      },
    });
  };

  return (
    <Show
      when={!postQuery.isPending}
      fallback={<div class="loading-message">Loading...</div>}
    >
      <Show
        when={postQuery.data}
        fallback={<div class="error-message">Post not found</div>}
      >
        <div class="container">
          <nav class="breadcrumb">
            <A href={`/posts/${params.id}`} class="breadcrumb__link">
              ← Back to Post
            </A>
          </nav>

          <div class="card">
            <h1>Edit Post</h1>

            <Show when={errors().length > 0}>
              <div class="error-messages">
                <For each={errors()}>{(error) => <div>{error}</div>}</For>
              </div>
            </Show>

            <form onSubmit={handleSubmit}>
              <div class="form__field">
                <label class="form__label" for="post-title">
                  Title
                </label>
                <input
                  class="form__input"
                  id="post-title"
                  type="text"
                  value={title()}
                  onInput={(e) => setTitle(e.currentTarget.value)}
                  required
                />
              </div>

              <div class="form__field">
                <label class="form__label" for="post-content">
                  Content
                </label>
                <textarea
                  class="form__textarea"
                  id="post-content"
                  rows="10"
                  value={content()}
                  onInput={(e) => setContent(e.currentTarget.value)}
                  required
                />
              </div>

              <div class="form__actions">
                <button
                  class="button button--primary button--normal"
                  type="submit"
                  disabled={updatePostMutation.isPending}
                >
                  {updatePostMutation.isPending ? "Updating..." : "Update Post"}
                </button>
                <A
                  href={`/posts/${params.id}`}
                  class="button button--secondary button--normal"
                >
                  Cancel
                </A>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </Show>
  );
}
