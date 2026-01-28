// app/(dashboard)/feed/page.tsx
export const runtime = 'nodejs'; // EZ A KRITIKUS SOR
export const dynamic = 'force-dynamic';
import React from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Post, User, Project } from '@prisma/client';
// Definiáljuk a komplex típust, amit a Prisma include-ol
type PostWithRelations = Post & {
  author: User;
  project: Project;
  _count: {
    comments: number;
  };
};

export default async function FeedPage() {
  const { db } = await import('@/lib/db');

  const posts: PostWithRelations[] = await db.post.findMany({
    include: {
      author: true,
      project: true,
      _count: {
        select: { comments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-slate-950 min-h-screen text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter italic">COLLAB_FEED</h1>
        <Button variant="outline" className="text-xs font-mono">NEW_POST +</Button>
      </header>

      {posts.length === 0 ? (
        <div className="text-center p-20 border border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-500 font-mono text-sm">NO_DATA_FOUND: Adatbázis üres.</p>
        </div>
      ) : (
        posts.map((post: PostWithRelations) => (
          <Card key={post.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar>
                <AvatarImage src={post.author.avatarUrl || ''} />
                <AvatarFallback className="bg-emerald-500 text-black">
                  {post.author.name?.substring(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-semibold">{post.author.name}</CardTitle>
                <span className="text-xs text-slate-500">
                  {post.project.name} • {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="text-sm leading-relaxed text-slate-300">
                {post.content}
              </div>
              {post.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-800">
                  <img src={post.imageUrl} alt="Post image" className="w-full object-cover max-h-96" />
                </div>
              )}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
                <button className="flex items-center gap-2 text-xs text-slate-400">
                  <Heart size={16} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-xs text-slate-400">
                  <MessageSquare size={16} /> {post._count.comments}
                </button>
                <button className="flex items-center gap-2 text-xs text-slate-400">
                  <Share2 size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}