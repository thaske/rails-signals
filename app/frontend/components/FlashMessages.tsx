import { For } from "solid-js";
import { useFlash } from "../utils/flash";
import "./FlashMessages.scss";

export default function FlashMessages() {
  const { messages, removeFlash } = useFlash();

  return (
    <div class="flash-messages">
      <For each={messages()}>
        {(message) => (
          <div
            classList={{
              "flash-messages__message": true,
              [`flash-messages__message--${message.type}`]: true,
            }}
          >
            <span class="flash-messages__text">{message.message}</span>
            <button
              class="flash-messages__close-button"
              type="button"
              onClick={() => removeFlash(message.id)}
            >
              ×
            </button>
          </div>
        )}
      </For>
    </div>
  );
}
