export function profileHref(handle: string) {
  return `/social/u?${new URLSearchParams({ handle })}`;
}

export function postReturnHref(value: string | string[] | undefined) {
  if (typeof value !== "string" || !value.startsWith("/social/u?"))
    return "/social";

  const handles = new URLSearchParams(value.slice("/social/u?".length)).getAll(
    "handle",
  );
  const handle = handles[0];

  return handles.length === 1 && handle && [...handle].length <= 30
    ? profileHref(handle)
    : "/social";
}
