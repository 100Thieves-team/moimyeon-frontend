import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useCommentDelete } from "./comment-delete-dialog";
import { Button } from "@/components/button";
import { formatCommentDate, type RoomComment } from "./room-comments-model";
import * as styles from "./room-comments.css";
import * as roomStyles from "./interview-room.css";

export function CommentRow({ comment, writable }: { comment: RoomComment; writable: boolean }) {
  const { handle, remove } = useCommentDelete();
  if (comment.isDeleted)
    return (
      <li className={styles.row}>
        <p className={styles.deleted}>삭제된 댓글입니다</p>
      </li>
    );
  const author = comment.author;
  return (
    <li className={styles.row}>
      <span
        className={styles.avatar}
        data-kind={author?.isHost ? "host" : comment.isMine ? "mine" : undefined}
        aria-hidden="true"
      >
        {Array.from(author?.nickname ?? "")[0] ?? "?"}
      </span>
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.nickname}>
            {author?.nickname}
            {author?.hasLeft ? " (퇴장)" : ""}
          </span>
          {author?.isHost && <span className={styles.hostBadge}>방장</span>}
          {comment.isMine && <span className={roomStyles.meBadge}>나</span>}
          <time className={styles.date} dateTime={comment.createdAt}>
            {formatCommentDate(comment.createdAt)}
          </time>
          {comment.isMine && writable && (
            <AlertDialog.Trigger
              handle={handle}
              payload={comment.commentId}
              disabled={remove.isPending}
              render={<Button variant="ghost" size="sm" className={styles.deleteButton} />}
            >
              삭제
            </AlertDialog.Trigger>
          )}
        </div>
        <p className={styles.content}>{comment.content}</p>
      </div>
    </li>
  );
}
