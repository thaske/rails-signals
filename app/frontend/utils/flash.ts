import { createSignal } from "solid-js";

export interface FlashMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const [flashMessages, setFlashMessages] = createSignal<FlashMessage[]>([]);

export const useFlash = () => {
  const addFlash = (
    message: string,
    type: FlashMessage["type"] = "success"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage: FlashMessage = { id, message, type };

    setFlashMessages([...flashMessages(), newMessage]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setFlashMessages((messages) => messages.filter((m) => m.id !== id));
    }, 3000);
  };

  const removeFlash = (id: string) => {
    setFlashMessages((messages) => messages.filter((m) => m.id !== id));
  };

  return {
    messages: flashMessages,
    addFlash,
    removeFlash,
  };
};
