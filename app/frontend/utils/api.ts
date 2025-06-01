function getCsrfToken(): string | null {
  return (
    document.querySelector<HTMLMetaElement>('[name="csrf-token"]')?.content ||
    null
  );
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`/api${url}`, {
    ...options,
    headers: {
      "X-CSRF-Token": getCsrfToken() || "",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
