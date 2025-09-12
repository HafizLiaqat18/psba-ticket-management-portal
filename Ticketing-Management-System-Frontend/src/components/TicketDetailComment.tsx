import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  _id: string;
  comment: string;
  createdAt: string;
  commentedBy: {
    name: string;
    avatarUrl?: string;
  };
}

interface Ticket {
  comments: Comment[];
  status: "open" | "in-progress" | "resolved" | "closed" | string;
}

interface TicketDetailCommentProps {
  ticket: Ticket;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  formatTime: (timestamp: number) => string;
}

export default function TicketDetailComment({
  ticket,
  newComment,
  setNewComment,
  handleAddComment,
  formatTime,
}: TicketDetailCommentProps) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-xl gap-1">
      <CardHeader className="bg-white py-2 px-4">
        <CardTitle className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          Comments ({ticket?.comments?.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between px-4 py-4">
        <div className="space-y-3 max-h-[300px] overflow-y-auto font-light pr-2 mr-2 mb-4">
          {ticket?.comments?.length === 0 && (
            <p className="text-gray-500 text-center py-4 font-light text-sm">
              No Comments yet. Be the first to add one!
            </p>
          )}

          {ticket?.comments?.map((comment) => (
            <div key={comment._id} className="flex items-start gap-2 mb-3">
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarImage
                  src={comment.commentedBy.avatarUrl || "/placeholder.svg"}
                  alt={comment.commentedBy.name}
                />
                <AvatarFallback className="text-xs bg-green-500 text-white">
                  {comment.commentedBy.name
                    .split(" ")
                    .map((n) => n?.[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {comment.commentedBy.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(new Date(comment.createdAt).getTime())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-3 bg-gray-200" />

        {ticket.status === "open" ? (
          <div className="py-2 px-2 text-sm text-gray-600">
            Accept the Ticket to add Comments
          </div>
        ) : (
          ticket.status !== "resolved" &&
          ticket.status !== "closed" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-20 text-sm"
              />
              <Button
                onClick={handleAddComment}
                size="sm"
                className="w-full bg-green-600"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
