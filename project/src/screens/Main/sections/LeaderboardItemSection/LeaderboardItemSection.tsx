'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar';
import { ArrowUp } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  photo: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  likes: number;
  username?: string; // optional, in case API includes username
}

export const LeaderboardItemSection = (): JSX.Element => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchVideos(p: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/v1/api/rest/video/PAGINATE', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: p, limit: 10, payload: {} }),
      });

      const json = await res.json();

      if (json.error) throw new Error(json.message || 'API error');

      setVideos(json.list);
      setPage(json.page);
      setNumPages(json.num_pages);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  return (
    <section className="w-full max-w-[1216px] mx-auto my-8 space-y-4">
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}

      {!loading && !error && videos.length === 0 && (
        <p className="text-sm text-muted-foreground">No videos found.</p>
      )}

      {!loading &&
        !error &&
        videos.map((item, idx) => (
          <Card
            key={item.id}
            className="rounded-2xl border border-solid border-[#ffffff1f] h-24"
          >
            <CardContent className="p-0 h-full flex items-center">
              {/* Rank number */}
              <div className="w-16 flex justify-center">
                <span className="font-thin text-[#666666] text-sm">
                  {String((page - 1) * 10 + idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Thumbnail */}
              <div
                className="w-[118px] h-16 bg-cover bg-center ml-2 rounded-lg"
                style={{ backgroundImage: `url(${item.photo})` }}
              />

              {/* Title */}
              <div className="w-[366px] ml-4 overflow-hidden">
                <h3 className="font-thin text-textcolor-text text-xl leading-7 truncate">
                  {item.title}
                </h3>
              </div>

              {/* Username with avatar (fallback if no username) */}
              <div className="flex items-center gap-2 ml-8">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src="/avatar.png"
                    alt={item.username || 'User'}
                    className="rounded-full"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="font-thin text-maincolor-secondary text-base leading-5">
                  {item.username || `User ${item.user_id}`}
                </span>
              </div>

              {/* Score with TrendingUp icon */}
              <div className="ml-auto mr-6 flex items-center gap-2">
                <span className="font-thin text-white text-base text-right leading-5">
                  {item.likes}
                </span>
                <ArrowUp className="w-5 h-5 text-[#9BFF00]" />
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Pagination */}
      {!loading && !error && numPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-[#333] text-sm text-white rounded-md disabled:opacity-30"
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {numPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, numPages))}
            disabled={page >= numPages}
            className="px-4 py-2 bg-[#333] text-sm text-white rounded-md disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
