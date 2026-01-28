// app/(dashboard)/feed/page.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { getDb } from '@/lib/db'; // 'db' helyett 'getDb' importálása
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share2 } from "lucide-react";

export default async function FeedPage() {
  const db = getDb(); // A db példány lekérése a függvényen belül

  const posts = await db.post.findMany({
    include: {
      author: true,
      project: true,
      comments: {
        include: {
          author: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tighter italic uppercase border-l-4 border-emerald-500 pl-4">
        RIEMANN_VALKYRIE // NEURAL_FEED
      </h1>

      {posts.length === 0 ? (
        <div className="text-center p-20 border border-dashed border-slate-800 rounded-xl opacity-50">
          <p className="font-mono text-sm tracking-widest text-slate-500">[NO_POSTS_FOUND_IN_STREAM]</p>
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="border border-slate-700">
                <AvatarImage src={post.author.avatarUrl || ''} />
                <AvatarFallback className="bg-slate-800 text-emerald-500 font-mono">
                  {post.author.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-bold text-slate-200">
                  {post.author.name}
                  <span className="ml-2 text-[10px] text-emerald-500 font-mono px-2 py-0.5 border border-emerald-500/20 rounded">
                    {post.project.name}
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {post.content}
              </p>
              
              <div className="flex items-center gap-6 pt-4 border-t border-slate-800/50">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-emerald-400 gap-2 font-mono text-xs">
                  <Heart size={16} /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-400 gap-2 font-mono text-xs">
                  <MessageSquare size={16} /> {post.comments.length}
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white ml-auto">
                  <Share2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}