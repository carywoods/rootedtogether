import { useState, useEffect } from 'react';
import { supabase, GardeningPost } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock, MapPin } from 'lucide-react';

export function Feed() {
  const { profile } = useAuthContext();
  const [posts, setPosts] = useState<GardeningPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [profile]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('gardening_posts')
        .select(`
          *,
          author:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gardening wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gardening Feed</h1>
          <p className="text-gray-600">Tips, tricks, and stories from your gardening community</p>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to share your gardening knowledge!</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      {post.author?.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.display_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {post.author?.display_name || 'Unknown User'}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        {post.growing_zone && (
                          <>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>Zone {post.growing_zone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                  
                  {post.image_url && (
                    <div className="mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}