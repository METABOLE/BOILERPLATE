import { VisualEditing } from "@sanity/visual-editing/next-pages-router";
import { DisableDraftMode } from "./disable-draft-mode";

export default function SanityVisualEditing() {
  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}