import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import './PostBox.css';
import { Button } from '@material-ui/core';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CreatePost from '../../components/CreatePost/CreatePost';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { BackendApi } from '../../api';

const PostBox = ({ isLogged, authenticationToken, userName }) => {
  const [openPostModal, setOpenPostModal] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [posts, setPosts] = useState([]);
  const [changeInPost, setChangeInPost] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      const response = await BackendApi.getPosts(authenticationToken);
      if (response.status >= 200 && response.status < 300) {
        setPosts(response.data);
        console.log(response.data);
      }
    };
    getPosts(authenticationToken);
  }, [changeInPost]);

  const handleOpenPostModal = () => {
    setOpenPostModal(true);
  };
  const handleClosePostModal = () => {
    setOpenPostModal(false);
  };
  return (
    <div style={{ padding: 14 }}>
      {isLogged && (
        <Button
          variant='outlined'
          startIcon={<PostAddIcon />}
          style={{ marginTop: 20 }}
          onClick={handleOpenPostModal}
        >
          Create Post
        </Button>
      )}

      <Modal
        open={openPostModal}
        onClose={handleClosePostModal}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, width: 800 }}>
          <CreatePost
            authenticationToken={authenticationToken}
            setOpenPostModal={setOpenPostModal}
            changeInPost={changeInPost}
            setChangeInPost={setChangeInPost}
          />
        </Box>
      </Modal>
      {posts &&
        posts.map((post, index) => (
          <Post
            index={index}
            key={index}
            title={post.title}
            user={isLogged ? post.username : 'Anonymous'}
            content={post.body}
            time={post.updated_at}
            category={post.category}
            upvote={post.upvote}
            downvote={post.downvote}
            isExpert={post.is_expert}
            isUpvoted={post.is_upvoted}
            isDownvoted={post.is_downvoted}
            location={post.location}
            image={post.image}
            isLogged={isLogged}
            slug={post.slug}
            authenticationToken={authenticationToken}
            changeInPost={changeInPost}
            setChangeInPost={setChangeInPost}
            userName={userName}
          />
        ))}
    </div>
  );
};

export default PostBox;
