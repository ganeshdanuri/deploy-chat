/**
 * Opens the registration flow. Lives here rather than as a prop threaded from
 * the page so the landing page itself can stay a server component and fetch
 * data during render.
 */
export function openRegister() {
  window.open("/login?register=true", "_blank", "noopener,noreferrer");
}
