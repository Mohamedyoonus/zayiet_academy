import { CourseCardsSkeleton, HeaderSkeleton } from "@/components/admin/skeletons";

// Shown instantly while this page's data loads
export default function Loading() {
  return (
    <>
      <HeaderSkeleton withButton />
      <CourseCardsSkeleton />
    </>
  );
}
