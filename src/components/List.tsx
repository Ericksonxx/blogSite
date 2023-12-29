import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

//mui imports
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


interface Post {
  id: number;
  body: string;
  title: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  url: string;
}

function App() {
  // get posts
  const { isPending: isPostsPending, error: postError, data: postData } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json()),
  });

  // get users
  const { isPending: isUserPending, error: userError, data: userData } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json()),
  });

  // get photos
  const { isPending: isPhotosPending, error: photosError, data: photosData } = useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/photos').then((res) => res.json()),
  });

  return(
    <div>
      {postData && photosData  ? (
              <div className="bg-gray-100 min-h-screen text-gray-800 p-6">
              <div className="w-[80%] mx-auto mt-24">
                <Typography gutterBottom variant="h3" component="div">
                  Latest Posts
                </Typography>
                <div>
                  {postData && (
                    <div className='lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                      {postData.map((post, i) => {
                        const user = userData?.find((u) => u.id === post.userId);
                        const photo = photosData?.find((p) => p.id === post.id);
        
                        const object = {
                          postId: post.id,
                          postBody: post.body,
                          postTitle: post.title,
                          userName: user?.name ?? 'Unknown User',
                          photo: photo?.url,
                        };
        
                        return (
                          <Link key={i} to={{pathname: `/posts/${post.id}`,}} state={object}>
                            <Card className='my-6 min-h-[325px]'>
                              {photo?.url && (
                                <CardMedia
                                  sx={{ height: 140 }}
                                  image={photo.url}
                                  title="post featured image"
                                />
                              )}
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {post.title}
                                </Typography>
                                <Typography className='line-clamp-2' variant="body2" color="text.secondary">
                                    {post.body}
                                </Typography>
                              </CardContent>
                            </Card>
                        </Link>        
                      );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
      ):(
        <div className='w-screen h-screen flex justify-center items-center'>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default App;
