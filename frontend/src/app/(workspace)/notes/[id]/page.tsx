
import EditorPage from "@/app/components/layout/editor/EditorPage";

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  return <EditorPage noteId={params.id} />;
}
