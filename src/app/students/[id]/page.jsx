import StudentProfileClient from "./StudentProfileClient";

export default async function StudentProfilePage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <StudentProfileClient id={id} />;
}
