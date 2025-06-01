import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { createSignal } from "solid-js";
import { apiRequest } from "../../utils/api";
import { useFlash } from "../../utils/flash";
import "../common.scss";
import "./comments.scss";

interface CommentFormProps {
  postId: number;
}

export default function CommentForm(props: CommentFormProps) {
  const [content, setContent] = createSignal("");
  const queryClient = useQueryClient();
  const { addFlash } = useFlash();

  const createCommentMutation = useMutation(() => ({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      const response = await apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment: { content } }),
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.postId] });
      addFlash("Comment added successfully!", "success");
      setContent("");
    },
    onError: () => {
      addFlash("Failed to add comment. Please try again.", "error");
    },
  }));

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const trimmedContent = content().trim();
    if (!trimmedContent) return;

    createCommentMutation.mutate({
      postId: props.postId,
      content: trimmedContent,
    });
  };

  return (
    <div class="comment-form">
      <form onSubmit={handleSubmit}>
        <div class="form__field">
          <label class="form__label" for="comment-content">
            Add a comment
          </label>
          <textarea
            class="form__textarea"
            id="comment-content"
            placeholder="Share your thoughts..."
            rows="3"
            value={content()}
            onInput={(e) => setContent(e.currentTarget.value)}
            disabled={createCommentMutation.isPending}
          />
        </div>
        <div class="form__actions">
          <button
            class="button button--primary button--normal"
            type="submit"
            disabled={createCommentMutation.isPending || !content().trim()}
          >
            {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
