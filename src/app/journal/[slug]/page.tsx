import { Metadata } from 'next';
import { getPostBySlug } from '@/data/blog';
import JournalDetailClient from './JournalDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Story Not Found | Maison Resorts',
    };
  }
  return {
    title: `${post.title} | Maison Resorts Journal`,
    description: post.excerpt,
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  return <JournalDetailClient slug={slug} />;
}
