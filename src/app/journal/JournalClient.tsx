'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS, BLOG_CATEGORIES, BlogCategory } from '@/data/blog';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function JournalClient() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  // Featured post (always the one marked as featured, or first if none)
  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  // Grid posts (excluding featured unless filtered specifically by category, in which case we show everything matching)
  const gridPosts = filteredPosts.filter((post) => {
    if (selectedCategory === 'All') {
      return post.id !== featuredPost.id;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-luxury text-white flex flex-col font-sans">
      <Nav />

      {/* Header Section */}
      <header className="relative py-24 text-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-luxury to-[#030e0b]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-accent/20 rounded-full blur-[180px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">Maison Editorial</span>
          <h1 className="text-6xl md:text-8xl font-bold font-serif italic tracking-tighter leading-none">
            Stories of <span className="text-accent not-italic">Arrival</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Exploring the frequencies of quiet luxury, heritage sanctuaries, and the intentional practices of slow travel.
          </p>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="sticky top-[88px] z-30 bg-luxury/90 backdrop-blur-xl border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center overflow-x-auto gap-4 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
              selectedCategory === 'All'
                ? 'bg-accent text-luxury border-accent shadow-lg shadow-accent/15'
                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-accent text-luxury border-accent shadow-lg shadow-accent/15'
                  : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full space-y-32">
        {/* Featured Post (Only show on 'All' category) */}
        {selectedCategory === 'All' && featuredPost && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white/5 border border-white/10 rounded-[3.5rem] p-8 md:p-12 overflow-hidden hover:border-accent/40 transition-all duration-700"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            {/* Featured Image */}
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl relative">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute top-6 left-6 bg-luxury/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold text-accent">
                Featured
              </div>
            </div>

            {/* Featured Details */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                  {featuredPost.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif italic text-white leading-tight tracking-tight group-hover:text-accent transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-400 font-light leading-relaxed text-lg">
                  {featuredPost.excerpt}
                </p>
              </div>

              {/* Author & Meta */}
              <div className="flex items-center gap-4">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                />
                <div className="text-left">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white">
                    {featuredPost.author.name}
                  </p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">
                    {featuredPost.author.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-t border-white/5 pt-6">
                <span className="flex items-center gap-2">
                  <Calendar size={12} className="text-accent/60" />
                  {new Date(featuredPost.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={12} className="text-accent/60" />
                  {featuredPost.readTime} min read
                </span>
              </div>

              <div>
                <Link
                  href={`/journal/${featuredPost.slug}`}
                  className="inline-flex items-center gap-3 bg-white text-luxury px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-xl group-hover:shadow-accent/5"
                >
                  Read Story
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* Posts Grid */}
        <section className="space-y-16">
          {selectedCategory !== 'All' && (
            <div className="border-b border-white/5 pb-6">
              <h3 className="text-xs uppercase tracking-[0.4em] text-accent font-bold">
                Showing {selectedCategory} Stories ({filteredPosts.length})
              </h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {gridPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group flex flex-col justify-between bg-white/3 border border-white/5 rounded-[3rem] p-6 hover:border-accent/30 hover:bg-white/5 transition-all duration-500"
                >
                  <div className="space-y-6">
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden rounded-[2rem] shadow-xl relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                      <div className="absolute bottom-4 left-4 bg-luxury/80 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold text-accent">
                        {post.category}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex gap-4 text-[9px] uppercase tracking-widest text-gray-500 font-bold px-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={10} className="text-accent/50" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={10} className="text-accent/50" />
                        {post.readTime} min
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 px-2">
                      <h3 className="text-2xl font-bold font-serif italic leading-tight text-white group-hover:text-accent transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 font-light leading-relaxed text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer Author & Read Link */}
                  <div className="border-t border-white/5 mt-8 pt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10"
                      />
                      <div className="text-left">
                        <p className="text-[8px] font-bold tracking-wider uppercase text-white">
                          {post.author.name}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="text-accent group-hover:text-white flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold transition-colors"
                    >
                      Read
                      <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {gridPosts.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-[3rem] space-y-4">
              <BookOpen className="mx-auto text-accent/40" size={48} />
              <p className="text-gray-500 font-light text-lg uppercase tracking-widest">
                No stories found in this category
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
