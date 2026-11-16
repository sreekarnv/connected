export function profileHref(handle: string) {
  return `/social/u?${new URLSearchParams({ handle })}`;
}
