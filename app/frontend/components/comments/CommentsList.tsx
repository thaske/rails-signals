import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { apiRequest } from "../../utils/api";
import { useFlash } from "../../utils/flash";
import "../common.scss";
import "./comments.scss";

interface Comment {
  id: number;
  content: string;
  user_name: string;
  created_at: string;
}

interface CommentsListProps {
  comments: Comment[];
  postId: number;
}

const CommentEditForm = (props: {
  editContent: string;
  setEditContent: (content: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}) => (
  <div>
    <div class="form__field">
      <textarea
        class="form__textarea"
        value={props.editContent}
        onInput={(e) => props.setEditContent(e.currentTarget.value)}
        rows="3"
      />
    </div>
    <div class="form__actions">
      <button
        class="button button--primary button--small"
        type="button"
        onClick={props.onUpdate}
        disabled={props.isUpdating || !props.editContent.trim()}
      >
        {props.isUpdating ? "Updating..." : "Update"}
      </button>
      <button
        class="button button--secondary button--small"
        type="button"
        onClick={props.onCancel}
        disabled={props.isUpdating}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default function CommentsList(props: CommentsListProps) {
  const [editingCommentId, setEditingCommentId] = createSignal<number | null>(
    null
  );
  const [editContent, setEditContent] = createSignal("");
  const queryClient = useQueryClient();
  const { addFlash } = useFlash();

  const updateCommentMutation = useMutation(() => ({
    mutationFn: async ({
      postId,
      commentId,
      content,
    }: {
      postId: number;
      commentId: number;
      content: string;
    }) => {
      const response = await apiRequest(
        `/posts/${postId}/comments/${commentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ comment: { content } }),
        }
      );
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.postId] });
      addFlash("Comment updated successfully!", "success");
      setEditingCommentId(null);
      setEditContent("");
    },
    onError: () => {
      addFlash("Failed to update comment. Please try again.", "error");
    },
  }));

  const deleteCommentMutation = useMutation(() => ({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      await apiRequest(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.postId] });
      addFlash("Comment deleted successfully!", "success");
    },
    onError: () => {
      addFlash("Failed to delete comment. Please try again.", "error");
    },
  }));

  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdate = async (commentId: number) => {
    updateCommentMutation.mutate({
      postId: props.postId,
      commentId,
      content: editContent(),
    });
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    deleteCommentMutation.mutate({
      postId: props.postId,
      commentId,
    });
  };

  return (
    <Show
      when={props.comments.length > 0}
      fallback={
        <div class="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      }
    >
      <div class="comments-list">
        <For each={props.comments}>
          {(comment) => (
            <div class="comment" data-comment-id={comment.id}>
              <Show
                when={editingCommentId() === comment.id}
                fallback={
                  <>
                    <div class="comment__header">
                      <div>
                        <span class="comment__author">{comment.user_name}</span>
                        <span class="comment__date">
                          {new Date(comment.created_at).toLocaleDateString(
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
                      <div class="comment__actions">
                        <button
                          class="button button--secondary button--tiny"
                          type="button"
                          onClick={() => startEdit(comment)}
                        >
                          Edit
                        </button>
                        <button
                          class="button button--danger button--tiny"
                          type="button"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div class="comment__content">
                      <For each={comment.content.split("\n")}>
                        {(line) => (
                          <>
                            {line}
                            <br />
                          </>
                        )}
                      </For>
                    </div>
                  </>
                }
              >
                <CommentEditForm
                  editContent={editContent()}
                  setEditContent={setEditContent}
                  onUpdate={() => handleUpdate(comment.id)}
                  onCancel={cancelEdit}
                  isUpdating={updateCommentMutation.isPending}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
