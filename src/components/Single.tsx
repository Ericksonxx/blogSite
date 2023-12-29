import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface Comment {
  name: string;
  email: string;
  body: string;
  postId: number;
  id: number;
}

function Single() {
  const location = useLocation();
  const { state } = location;
  const post = state && location.state;
  const postIdParams = useParams();
  const { state: locationState } = location;

  // get posts
  const { isPending: isPostsPending, error: postError, data: postData } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts/${postIdParams.postId}`).then((res) => res.json()),
    enabled: !locationState,
  });

  // get photo
  const { isPending: isPhotoPending, error: photoError, data: photoData } = useQuery({
    queryKey: ['photo', postIdParams.postId],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/photos/${postIdParams.postId}`).then((res) => res.json()),
    enabled: !postData,
  });

  // get user
  const { isPending: isUserPending, error: userError, data: userData } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/users/${postIdParams?.postId}/`).then((res) => res.json()),
    enabled: !postData,
  });

  // get comments
  const { isPending: isCommentsPending, error: commentsError, data: commentsData } = useQuery({
    queryKey: ['comments'],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/comments`).then((res) => res.json()),
  });

  return (
    <div className='bg-gray-100 text-gray-800'>
      {post || postData ? (
        <div>
          <img
            className='w-screen h-[80vh] object-cover'
            src={post?.photo || (photoData && photoData.url)}
            alt='Post'
          />
          <div className='px-[10%] py-12'>
            <Typography data-testid="post-title" variant='h2' sx={{ marginY: '30px' }}>
              {post?.postTitle || (postData && postData.title)}
            </Typography>
            <Typography data-testid="post-username" variant='overline'>
              Written by <u>{post?.userName || (userData && userData.name)}</u>
            </Typography>
            <Typography data-testid="post-body" variant='body1' sx={{ marginY: '30px' }}>
              {post?.postBody || (postData && postData.body)}
            </Typography>
          </div>
          <div>
            {commentsData && commentsData.length > 0 ? (
              <div className='px-[10%] py-12'>
                <Typography variant='h4' sx={{ marginY: '30px' }}>
                  Comments
                </Typography>
                {commentsData
                  .filter((comment: Comment) => comment.postId === (post?.postId || postIdParams.postId))
                  .map((filteredComment: Comment, i: number) => (
                    <div key={i}>
                      {filteredComment && (
                        <Paper sx={{ marginY: '15px', borderRadius: '5px', padding: '15px' }}>
                          <Typography variant='subtitle1'>{filteredComment?.body}</Typography>
                          <hr className='my-2' />
                          <Typography variant='subtitle2'>{filteredComment?.email}</Typography>
                        </Paper>
                      )}
                    </div>
                  ))}
                {commentsData
                  .filter((comment: Comment) => comment.postId === (post?.postId || postIdParams.postId))
                  .length === 0 && (
                  <div className='py-12'>
                    <div className='text-center bg-gray-700 w-[80%] mx-auto p-6 rounded-xl shadow-xl'>
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        No comments in this post yet
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Typography variant='body1'>No comments available for this post.</Typography>
            )}
          </div>
        </div>
      ) : (
        <div data-testid="loading" className='w-screen h-screen flex justify-center items-center'>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default Single;
