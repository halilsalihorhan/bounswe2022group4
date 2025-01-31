import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Avatar, Button, MenuItem, Menu } from '@material-ui/core';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
} from '@mui/icons-material';
import { BackendApi } from '../../api';
import './Post.css';
import CreateComment from '../CreateComment/CreateComment';
import CommentBox from '../CommentBox/CommentBox';
import ReportPost from '../ReportPost/ReportPost';
import Annotation from 'react-image-annotation';
import { Recogito } from '@recogito/recogito-js';
import '@recogito/recogito-js/dist/recogito.min.css';
import {
  IconButton,
  Collapse,
  Card,
  Box,
  Modal,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditPost from '../EditPost/EditPost';
const imgLink =
  'https://st.depositphotos.com/2101611/4338/v/600/depositphotos_43381243-stock-illustration-male-avatar-profile-picture.jpg';
const doctorPhoto = 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png';

const Post = ({
  title,
  user,
  content,
  time,
  index,
  image,
  category,
  slug,
  changeInPost,
  setChangeInPost,
  upvote,
  downvote,
  isExpert,
  location,
  postPageButton,
  isUpvoted,
  isDownvoted,
}) => {
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
  const [textAnnotation, setTextAnnotation] = useState();
  useEffect(() => {
    const postTextAnnotation = async () => {
      const r = new Recogito({
        content: document.getElementById('body-text' + slug),
      });
      r.on('createAnnotation', function(propsTextAnnotation) {
        setTextAnnotation(propsTextAnnotation);
      });
      let position = {
        start: textAnnotation.target.selector[1].start,
        end: textAnnotation.target.selector[1].end,
      };

      let data = {
        text: textAnnotation.body[0].value,
        source: 'http://3.72.25.175:3000/' + slug,
      };
      const response = await BackendApi.postTextAnnotation(
        slug,
        position,
        data
      );
    };
    postTextAnnotation();
  }, [textAnnotation]);
  const [authToken, setAuthToken] = React.useState('');
  const [loggedUser, setLoggedUser] = React.useState('');
  const [commentCount, setCommentCount] = React.useState(0);
  useEffect(() => {
    setLoggedUser(localStorage['user']);
  }, [localStorage['user']]);
  useEffect(() => {
    setAuthToken(localStorage['authToken']);
  }, [localStorage['authToken']]);

  const [openCreateCommentModal, setOpenCreateCommentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenReportModal = () => {
    setOpenReportModal(true);
  };
  const handleCloseReportModal = () => {
    setOpenReportModal(false);
  };
  const handleOpenCreateCommentModal = () => {
    setOpenCreateCommentModal(true);
  };
  const handleCloseCreateCommentModal = () => {
    setOpenCreateCommentModal(false);
  };
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleDelete = async (slug) => {
    await BackendApi.postDeletePost(slug + '/', authToken);
    setChangeInPost(!changeInPost);
  };
  const handleUpvote = async () => {
    const response = await BackendApi.postUpvotePost(slug, authToken);
    setChangeInPost(!changeInPost);
  };
  const handleDownvote = async () => {
    const response = await BackendApi.postDownvotePost(slug, authToken);
    setChangeInPost(!changeInPost);
  };

  // const handleEdit =
  const [imageAnnotation, setImageAnnotation] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState({});
  const onAnnotationChange = (annotation) => {
    setCurrentAnnotation(annotation);
  };
  const onAnnotationSubmit = async (annotation) => {
    const { geometry, data } = annotation;
    setImageAnnotation(
      imageAnnotation.concat({
        geometry,
        data: { ...data, id: Math.random() },
      })
    );
    let modifiedData = {
      ...data,
      source: 'http://3.72.25.175:3000/' + slug,
    };

    const response = await BackendApi.postImageAnnotation(
      slug,
      geometry,
      modifiedData
    );
  };
  useEffect(() => {
    const getImageAnnotation = async () => {
      const response = await BackendApi.getImageAnnotation(slug);
      const data = response?.data;
      let imageAnnotationList = [];
      data.map((item) => {
        let geometryText = item.json.target.selector.value.split('xywh=')[1];
        let geometry = geometryText.split(',');
        let x = parseFloat(geometry[0]);
        let y = parseFloat(geometry[1]);
        let width = parseFloat(geometry[2]);
        let height = parseFloat(geometry[3]);
        setImageAnnotation(
          imageAnnotation.concat({
            geometry,
            data: { ...data, id: Math.random() },
          })
        );
        imageAnnotationList.push({
          geometry: {
            x: x,
            y: y,
            width: width,
            height: height,
            type: 'RECTANGLE',
          },
          data: {
            text: item.json.body.value,
            id: Math.random(),
          },
        });
      });
      setImageAnnotation(imageAnnotationList);
    };
    const getTextAnnotation = async () => {
      const response = await BackendApi.getTextAnnotation(slug);
      const data = response?.data;
      const r = new Recogito({
        content: document.getElementById('body-text' + slug),
      });

      data.map((item) => {
        let text = item.json.body.value;
        let start = item.json.target.selector.start;
        let end = item.json.target.selector.end;
        r.addAnnotation({
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          type: 'Annotation',
          body: [
            {
              type: 'TextualBody',
              value: text,
              purpose: 'commenting',
            },
          ],
          target: {
            selector: [
              {
                type: 'TextQuoteSelector',
                exact: text,
              },
              {
                type: 'TextPositionSelector',
                start: start,
                end: end,
              },
            ],
          },
          // id: '#1b4017ca-9a93-4f8d-ac32-da32adf8b1d2',
          slug: slug,
        });
      });
    };
    getImageAnnotation();
    getTextAnnotation();
  }, []);
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  const [changeInComments, setChangeInComments] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      const response = await BackendApi.getComments(slug, authToken);
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        setCommentCount(response.data.length);
      }
    };
    getComments(slug, authToken);
  }, [changeInComments]);
  const subheader = (
    <div>
      <Typography variant='body2' color='text.secondary'>
        {time}
      </Typography>
      {authToken && (
        <Typography variant='body2' color='text.secondary'>
          {location}
        </Typography>
      )}
    </div>
  );
  return (
    <Card
      sx={{ maxWidth: 1000, padding: '40px 20px', marginTop: 5 }}
      style={{
        backgroundImage: 'linear-gradient(-225deg, #e3fdf5 50%, #ffe6fa 50%)',
        minWidth: '800px',
        boxShadow: 'rgb(0 0 0 / 35%) 0px 5px 15px',
      }}
      data-testid='post'
    >
      <div>
        <CardHeader
          avatar={
            authToken ? (
              <Link to={'/profile/' + user}>
                <Avatar
                  alt='Unknown Profile Picture'
                  src={isExpert ? doctorPhoto : imgLink}
                />
              </Link>
            ) : (
              <Avatar
                alt='Unknown Profile Picture'
                src={isExpert ? doctorPhoto : imgLink}
              />
            )
          }
          title={user}
          subheader={subheader}
          action={
            <div>
              {postPageButton && (
                <Link
                  to={'/post/' + slug}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: 'none',
                  }}
                >
                  <Button>Post Page</Button>
                </Link>
              )}
              {authToken && (
                <Button
                  endIcon={<ReportProblemOutlinedIcon />}
                  onClick={handleOpenReportModal}
                ></Button>
              )}

              <Button startIcon={<ThumbUpIcon />} onClick={handleUpvote}>
                {upvote}
              </Button>
              <Button startIcon={<ThumbDownIcon />} onClick={handleDownvote}>
                {downvote}
              </Button>
              {loggedUser === user && (
                <>
                  <Button onClick={handleOpenEditModal}> Edit</Button>
                  <IconButton aria-label='settings' onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                </>
              )}
            </div>
          }
        />
        <CardContent>
          <Typography
            variant='sub-header'
            style={{ margin: 0, textAlign: 'left' }}
          >
            {category}
          </Typography>
        </CardContent>
        {loggedUser === user && (
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleDelete(slug);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        )}

        <CardContent>
          <Typography style={{ margin: 0, textAlign: 'left' }}>
            {title}
          </Typography>
        </CardContent>
      </div>
      {image && (
        <Annotation
          src={image}
          annotations={imageAnnotation}
          value={currentAnnotation}
          onChange={onAnnotationChange}
          onSubmit={onAnnotationSubmit}
          style={{ height: '350px' }}
        />
      )}
      <CardContent>
        <Typography
          variant='body2'
          color='text.secondary'
          id={'body-text' + slug}
        >
          {content}
          {/* {content} */}
        </Typography>
      </CardContent>
      <Divider style={{ height: '4px' }} />
      <CardActions>
        {authToken && (
          <Button
            startIcon={<CommentIcon />}
            onClick={handleOpenCreateCommentModal}
            data-testid={'comment-button-' + index}
            style={{ fontFamily: 'inherit' }}
          >
            Add Comment
          </Button>
        )}
        <Modal
          open={openReportModal}
          onClose={handleCloseReportModal}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box sx={{ ...style, width: 800 }}>
            <ReportPost setOpenReportModal={setOpenReportModal} />
          </Box>
        </Modal>

        <Modal
          open={openCreateCommentModal}
          onClose={handleCloseCreateCommentModal}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box sx={{ ...style, width: 800 }}>
            <CreateComment
              authenticationToken={authToken}
              slug={slug}
              setOpenCreateCommentModal={setOpenCreateCommentModal}
              changeInComments={changeInComments}
              setChangeInComments={setChangeInComments}
            />
          </Box>
        </Modal>
        <Modal
          open={openEditModal}
          onClose={handleCloseEditModal}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box sx={{ ...style, width: 800 }}>
            <EditPost
              imageProp={image}
              authenticationToken={authToken}
              setOpenEditModal={setOpenEditModal}
              changeInPost={changeInPost}
              setChangeInPost={setChangeInPost}
              title={title}
              body={content}
              slug={slug}
              category={category}
            />
          </Box>
        </Modal>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
          style={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          SHOW COMMENTS {'('} {commentCount} {')'}
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <CommentBox
            slug={slug}
            changeInComments={changeInComments}
            setChangeInComments={setChangeInComments}
            //etCommentForPost = {setCommentCount}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};
export default Post;
