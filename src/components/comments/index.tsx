import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const Comments = ({ id }: { id: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");

  const fetchComments = async () => {
    const response = await axios.get(`/api/comments?id=${id}`);
    setComments(response.data.data);
  }

  const addComment = async () => {
    const response = await axios.post(`/api/comments?id=${id}`, {
      id,
      comment,
    });
    fetchComments()
    setComment("")
  }

  const getDataTime = (data: string) => {
    const timestamp = Date.parse(data);
    const date = new Date(timestamp);
    const dateFormat = date.getHours() + ":" + date.getMinutes() + " " + date.toDateString();

    return dateFormat;
  }

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    console.log("COMMENTS:", comments);
  }, [comments]);

  return (
    <>
      <div className="flex items-center justify-between gap-3.5 mb-4 font-medium text-[#94A0B4]">
        <span>{comments.length}</span>
        <span>Lesson 6 of 12</span>
      </div>

      <div className="px-6 py-5 rounded-xl shadow-md">
        <h2 className="mb-6 font-semibold">Comments</h2>
        {comments.length > 0 ? (
          <ul className="flex flex-col gap-5">
            {
              comments.map((el) => (
                <li key={el.id} className="px-3 py-4 bg-[#F7F9FC]">
                  <h4 className="mb-2 text-sm font-medium">{el.user_id}</h4>
                  <p className="text-xs font-medium text-[#717E95]">{el.comment}</p>
                </li>
              ))
            }
          </ul>
        ) : (
          <p className="text-center text-xs font-medium text-[#717E95]">No comments</p>
        )}

        <div className="flex items-center gap-4 mt-16 px-5 py-3.5 rounded-[10px] bg-[#F7F9FC]">
          <input
            type="text"
            className="w-full px-8 py-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
          />
          <button className="" onClick={addComment}>
            <Image src="/images/send.png" width={40} height={40} alt="send" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Comments