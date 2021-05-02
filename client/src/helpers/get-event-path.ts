import format from "date-fns/format";

export default function getEventPath({
  publishedAt,
  slug,
}: {
  publishedAt: string;
  slug: { current?: string };
}) {
  const dateSegment = format(new Date(publishedAt), "yyyy/MM");

  return `/event/${dateSegment}/${slug.current}/`;
}
