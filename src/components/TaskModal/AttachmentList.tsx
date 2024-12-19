import React from 'react';
import { Attachment } from '../../types';
import { Paperclip, Download } from 'lucide-react';

interface AttachmentListProps {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900">Attachments</h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{attachment.name}</span>
            </div>
            <a
              href={attachment.url}
              download
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}