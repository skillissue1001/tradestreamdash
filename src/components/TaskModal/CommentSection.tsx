import React, { useState } from 'react';
import { Comment, TeamMember } from '../../types';
import { Send } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  teamMembers: TeamMember[];
}

export function CommentSection({ comments, teamMembers }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Comments</h3>
      
      <div className="space-y-4">
        {comments.map((comment) => {
          const author = teamMembers.find((m) => m.id === comment.authorId);
          return (
            <div key={comment.id} className="flex space-x-3">
              <span className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg">
                {author?.avatar}
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{author?.name}</span>
                  <span className="text-sm text-gray-500">
                    {comment.createdAt.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}