export default function Page({ params }: { params: { slug: string } }) {
  return <div>Training ID: {params.slug}</div>;
}
