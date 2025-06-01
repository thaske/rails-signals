import { A, useNavigate } from "@solidjs/router";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { apiRequest } from "../../utils/api";
import { useFlash } from "../../utils/flash";
import "../common.scss";
import "./PostNew.scss";

export default function PostNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addFlash } = useFlash();
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [errors, setErrors] = createSignal<string[]>([]);

  const createPostMutation = useMutation(() => ({
    mutationFn: async (postData: { title: string; content: string }) => {
      const response = await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify({ post: postData }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      addFlash("Post created successfully!", "success");
      navigate(`/posts/${data.id}`);
    },
    onError: () => {
      setErrors(["Failed to create post. Please try again."]);
    },
  }));

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setErrors([]);

    createPostMutation.mutate({
      title: title(),
      content: content(),
    });
  };

  return (
    <div class="container">
      <nav class="breadcrumb">
        <A href="/" class="breadcrumb__link">
          ← Back to Feed
        </A>
      </nav>

      <div class="card">
        <h1>New Post</h1>

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
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Creating..." : "Create Post"}
            </button>
            <A href="/" class="button button--secondary button--normal">
              Cancel
            </A>
          </div>
        </form>
      </div>
    </div>
  );
}
