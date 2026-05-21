'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

interface JournalDetailClientProps {
  slug: string;
}

export default function JournalDetailClient({ slug }: JournalDetailClientProps) {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-luxury text-white flex flex-col font-sans">
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-6">
          <h1 className="text-4xl font-bold font-serif italic text-accent">Story Not Found</h1>
          <p className="text-gray-400 max-w-md text-center font-light">
            The requested editorial publication could not be located in our archives.
          </p>
          <Link
            href="/journal"
            className="inline-flex items-center gap-3 border border-white/10 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
          >
            <ArrowLeft size={12} />
            Back to Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  // Custom styled Markdown renderer
  function renderMarkdown(content: string) {
    const blocks = content.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-3xl md:text-4xl font-bold font-serif italic text-white mt-16 mb-6 tracking-tight"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl md:text-2xl font-bold font-serif italic text-accent mt-12 mb-4 tracking-tight"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-accent pl-8 my-10 font-serif italic text-xl md:text-2xl text-gray-300 leading-relaxed bg-white/3 p-8 rounded-r-[2rem]"
          >
            {trimmed.replace(/>\s*/g, '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item) => item.replace(/-\s*/, ''));
        return (
          <ul key={idx} className="list-none space-y-4 my-8 pl-4">
            {items.map((item, i) => {
              const boldMatch = item.match(/\*\*(.*?)\*\*(.*)/);
              if (boldMatch) {
                return (
                  <li key={i} className="flex items-start gap-4 font-light text-gray-400 text-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-3 flex-shrink-0" />
                    <span>
                      <strong className="font-bold text-white uppercase tracking-wider text-[11px] block md:inline md:mr-2">
                        {boldMatch[1]}
                      </strong>
                      {boldMatch[2]}
                    </span>
                  </li>
                );
              }
              return (
                <li key={i} className="flex items-start gap-4 font-light text-gray-400 text-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Format bold text inline (**text**)
      const parts = trimmed.split('**');
      if (parts.length > 1) {
        return (
          <p key={idx} className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-8">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-bold text-white">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      return (
        <p key={idx} className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-8">
          {trimmed}
        </p>
      );
    });
  }

  return (
    <div className="min-h-screen bg-luxury text-white flex flex-col font-sans">
      <Nav />

      {/* Hero Header */}
      <header className="relative w-full h-[65vh] md:h-[75vh] flex items-end overflow-hidden border-b border-white/5">
        {/* Cover Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury via-luxury/30 to-transparent" />
        </div>

        {/* Back Link & Meta */}
        <div className="max-w-4xl mx-auto px-6 pb-16 w-full relative z-10 space-y-6">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-accent transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-serif italic text-white tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6">
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white">
                  {post.author.name}
                </p>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider">
                  {post.author.role}
                </p>
              </div>
            </div>

            {/* Read Time & Date */}
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <span className="flex items-center gap-2">
                <Calendar size={12} className="text-accent/60" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={12} className="text-accent/60" />
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="max-w-3xl mx-auto px-6 py-24 w-full">
        <article className="prose prose-invert max-w-none">
          {renderMarkdown(post.content)}
        </article>
      </main>

      {/* Related Posts Section */}
      <section className="bg-white/3 border-t border-b border-white/5 py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">
              Further Reading
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif italic text-white tracking-tight">
              Stories of <span className="text-accent not-italic">Arrival</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/journal/${rPost.slug}`}
                className="group flex flex-col justify-between bg-luxury border border-white/5 rounded-[2.5rem] p-6 hover:border-accent/30 transition-all duration-500"
              >
                <div className="space-y-6">
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.8rem] shadow-xl relative">
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                    />
                    <div className="absolute bottom-4 left-4 bg-luxury/80 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold text-accent">
                      {rPost.category}
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold font-serif italic text-white group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {rPost.title}
                    </h3>
                    <p className="text-gray-400 font-light text-sm line-clamp-3 leading-relaxed">
                      {rPost.excerpt}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rPost.author.avatar}
                      alt={rPost.author.name}
                      className="w-6 h-6 rounded-md object-cover border border-white/10"
                    />
                    <span className="text-[8px] font-bold tracking-wider uppercase text-gray-400">
                      {rPost.author.name}
                    </span>
                  </div>
                  <span className="text-accent group-hover:text-white flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold transition-colors">
                    Read
                    <ArrowRight size={8} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
