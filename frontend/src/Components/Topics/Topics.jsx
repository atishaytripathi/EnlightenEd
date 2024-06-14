import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TopicStyles from './Topics.css';
import { GrArticle } from 'react-icons/gr';
import { FaYoutube } from 'react-icons/fa';
import { PiNotePencil } from 'react-icons/pi';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { Tooltip } from 'antd';
import { Snackbar } from '@mui/material';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [topicProgress, setTopicProgress] = useState([]);
  const [course, setCourse] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [video, setVideo] = useState({ title: '', video: '' });
  const [openNotes, setOpenNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(EditorState.createEmpty());
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [currentTopicTitle, setCurrentTopicTitle] = useState(''); // New state variable
  const location = useLocation();
  const courseId = location.state;

  const token = Cookies.get('token');
  const isMounted = useRef(false); // Add ref to track mounted status

  useEffect(() => {
    isMounted.current = true; // Component is mounted
    return () => {
      isMounted.current = false; // Cleanup when unmounting
    };
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded)
      setUserEmail(decoded?.username);
    }
  }, [token, userEmail]);

  useEffect(() => {
    const fetchTopics = async () => {
      if(!topics.length){
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/userPanel/getTopicsByCourse/${courseId}`);
          console.log(response.data)

          if (isMounted.current) {
            setTopics(response?.data);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching topics:', error);
        }
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/userPanel/getCourseByCourseId/${courseId}`);
        if (isMounted.current) {
          setCourse(response?.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    const fetchUserId = async () => {
      console.log('123',userEmail)
      if (userEmail) {
        try {
          
          const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/user/getUser/${userEmail}`);
          console.log('userid',response?.data)
          if (isMounted.current) {
            setUserId(response?.data);
          }
          console.log(userId)
        } catch (error) {
          console.error('Error fetching User ID:', error);
        }
      }
    };

    const fetchCourseProgress = async () => {
      if(userId && courseId){
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/courseProgress/getCourseProgress/${userId}/${courseId}`);
          if (isMounted.current && response) {
            setIsEnrolled(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
      
    };

    const fetchTopicProgress = async () => {
      if (topics.length !== 0 && userId && courseId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/getAllTopicProgresses/${userId}/${courseId}`);
          if (isMounted.current) {
            setTopicProgress(response?.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchCourse();
    fetchTopics();
    fetchUserId();
    fetchCourseProgress();
    fetchTopicProgress();
  }, [token, courseId, userEmail, userId, topics.length]);

  const fieldConfig = {
    checkbox: { label: 'Status' },
    title: { label: 'Title' },
    blogs: { label: 'Article' },
    videos: { label: 'Video' },
    notes: { label: 'Note' },
    starred: { label: 'Revision' }
  };

  const orderedFields = Object.keys(fieldConfig);

  const toggleArticle = (topic) => {
    if (topic?.blogs?.length === 1) {
      window.open(topic?.blogs[0], '_blank', 'noopener,noreferrer');
    }
  };

  const toggleVideo = (title, video) => {
    setVideo({ title: title, video: video });
    setOpenVideo(true);
  };
  const handleCloseLoginAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenLoginAlert(false);
  };
  // const loginAlert = (() => {
  //   if(!token) {
  //     setOpenLoginAlert(true);
  //   }
  // })
  const toggleNotes = async (title, note, topicId) => {
    await createTopicProgressIfNotExists(topicId);
    setCurrentTopicId(topicId);
    setCurrentTopicTitle(title); // Set the current topic title

    try {
      // Fetch the entire topic progress for the specified user, course, and topic
      const response = await axios.get(
        `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/getTopicProgress/${userId}/${courseId}/${topicId}`
      );

      const topicProgressData = response?.data;

      // Extract the notes from the topic progress data
      const { notes: lastSavedNote } = topicProgressData;

      let newNoteContent;

      if (lastSavedNote) {
        try {
          const parsedNote = JSON.parse(lastSavedNote);
          const contentState = convertFromRaw(parsedNote);
          newNoteContent = EditorState.createWithContent(contentState);
        } catch (error) {
          console.error('Error parsing note content:', error);
          newNoteContent = EditorState.createEmpty();
        }
      } else {
        newNoteContent = EditorState.createEmpty();
      }

      if (isMounted.current) {
        setNoteContent(newNoteContent);
        setOpenNotes(true);
      }
    } catch (error) {
      console.error('Error fetching topic progress:', error);
    }
  };

  const createTopicProgressIfNotExists = async (topicId) => {
    const existingProgress = topicProgress.find(progress => progress?.topicId === topicId);
    if (!existingProgress) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/createTopicProgress/${userId}/${courseId}/${topicId}`,
          {
            userId,
            courseId,
            topicId
          }
        );
        const updatedProgressResponse = await axios.get(
          `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/getAllTopicProgresses/${userId}/${courseId}`
        );
        if (isMounted.current) {
          setTopicProgress(updatedProgressResponse?.data);
        }
      } catch (error) {
        console.error('Error creating topic progress:', error);
      }
    }
  };

  const handleCheckboxChange = async (topicId) => {
    await createTopicProgressIfNotExists(topicId);
    const newProgress = !topicProgress?.find(progress => progress?.topicId === topicId)?.checkbox;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/updateTopicProgress/${userId}/${courseId}/${topicId}`,
        { checkbox: newProgress }
      );

      if (isMounted.current) {
        setTopicProgress((prev) =>
          prev?.map((progress) =>
            progress?.topicId === topicId ? { ...progress, checkbox: newProgress } : progress
          )
        );
      }
    } catch (error) {
      console.error('Error updating checkbox:', error);
    }
  };

  const handleStarredChange = async (topicId) => {
    await createTopicProgressIfNotExists(topicId);
    const newStarred = !topicProgress.find(progress => progress?.topicId === topicId)?.starred;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/updateTopicProgress/${userId}/${courseId}/${topicId}`,
        { starred: newStarred }
      );

      if (isMounted.current) {
        setTopicProgress((prev) =>
          prev.map((progress) =>
            progress?.topicId === topicId ? { ...progress, starred: newStarred } : progress
          )
        );
      }
    } catch (error) {
      console.error('Error updating starred status:', error);
    }
  };

  const handleCloseNotes = () => {
    setOpenNotes(false);
  };

  const handleSaveNotes = async () => {
    const rawContent = JSON.stringify(convertToRaw(noteContent.getCurrentContent()));
    // console.log(rawContent)
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BACKEND_URL}/topicProgress/updateTopicProgress/${userId}/${courseId}/${currentTopicId}`,
        { notes: rawContent }
      );
    } catch (error) {
      console.error('Error saving notes:', error);
    }
    setOpenNotes(false);
  };

  const handleClose = () => setOpenVideo(false);
  
  const createCourseProgress = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BACKEND_URL}/courseProgress/createCourseProgress/${userId}/${courseId}`);
      if (response.status === 201) {
        console.log('Enrollment status updated and course & topic progress created successfully.');
        setIsEnrolled(true);
      }
      console.log('courseprogress',response?.data)
    } catch (error) {
      console.error('Error occurred:', error.message);
    }
  };

  const topicProgressMap = topicProgress.reduce((acc, progress) => {
    acc[progress?.topicId] = progress;
    return acc;
  }, {});

  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>Loading...</div>;
  }

  return (
    <div className="topics-page">
      <div className='course-data'>
        <div className='course-head'>
          <div className='title'>
            <h1>{course.title}</h1>
          </div>
          <div>
            <div className='info'>
              <div>
                <div>Field : {course.field}</div>
              </div>
              <div>
                <div>Level : {course.difficulty}</div>
              </div>
            </div>
            {token && <div className='sub-btn-area' style={isEnrolled ? { cursor: 'pointer', backgroundColor: 'black', color: 'white' } : {}}>
              <div className='sub-btn' onClick={createCourseProgress}>{isEnrolled ? 'Enrolled' : 'Enroll'}</div>
            </div>}
          </div>
        </div>
        <div className='course-desc' style={{ marginTop: '5%', padding: ' 0 2%' }}>
          <p>{course.description}</p>
        </div>
      </div>
      <div className='table-area'>
        {topics?.length !== 0
          ?
          <table className="topics-table">
            <thead>
              <tr>
                {orderedFields.map(key => (
                  <th key={key}>{fieldConfig[key].label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {topics.map((topic) => {
              const progress = topicProgressMap[topic._id] || {};
              const { checkbox, notes, starred } = progress;
              return (
                <tr key={topic._id}>
                  <td>
                    <div className='table-data'>
                      <Tooltip key={topic} title={checkbox ?'Mark as undone':'Mark as done'} arrow><input type="checkbox" checked={checkbox} onChange={() => handleCheckboxChange(topic._id)} style={{ cursor: 'pointer' }} /></Tooltip>
                    </div>
                  </td>
                  <td style={{ paddingLeft: '3%', cursor:'default' }}>{topic.title}</td>
                  <td>
                    <div className='table-data' style={{cursor:'default'}}>
                      {/* {console.log(topic.blogs[0].length)} */}
                      {topic?.blogs[0]?.length === 0
                        ? "Soon..."
                        : topic?.blogs[0] === "-" ? "-"
                          : <Tooltip key={topic} title='View Documentation' arrow><GrArticle onClick={() => {toggleArticle(topic)}} style={{ cursor: 'pointer' }} /></Tooltip>}
                    </div>
                  </td>
                  <td>
                    <div className='table-data'>
                      {topic?.videos[0]?.length === 0
                        ? "Soon..."
                        : <Tooltip key={topic} title='Watch Video' arrow><FaYoutube style={{ cursor: 'pointer' }} onClick={() => { toggleVideo(topic.title, topic.videos) }} /></Tooltip>}
                    </div>
                  </td>
                  <td>
                    <div className='table-data'>
                      <Tooltip key={topic} title='Add Notes' arrow><PiNotePencil style={{ cursor: 'pointer' }} onClick={() => {
                        if(!token){
                          setOpenLoginAlert(true);
                        }
                        toggleNotes(topic?.title, topic?.notes, topic?._id)
                      }} /></Tooltip>
                    </div>
                  </td>
                  <td>
                    <div className='table-data' style={{ cursor: 'pointer' }} onClick={() => {
                      if(!token){
                        setOpenLoginAlert(true);
                      }
                      handleStarredChange(topic?._id)}}>
                      <Tooltip key={topic} title={starred ?'Unmark for Revision':'Mark for Revision'} arrow>{starred ? <StarIcon style={{ fill: starred ? 'gold' : '' }} /> : <StarBorderIcon />}</Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
          :
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>Topics will be added soon...</div>}
      </div>
      <Modal
        open={openVideo}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: 'none',
          borderRadius: '10px',
          boxShadow: 24,
          p: 4,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ color: 'black', marginLeft: '10px', marginTop: '8px', fontWeight: '600', fontSize: 'larger' }}>
                {video.title}
              </div>
              <div style={{
                alignSelf: 'end', padding: '10px', fontWeight: '600', color: 'black',
                marginRight: '10px', borderWidth: '2px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                cursor: 'pointer', borderRadius: '5px'
              }} onClick={handleClose}>Close</div>
            </div>
            <iframe width="720" height="405" src={video?.video}
              title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
            gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openNotes}
        onClose={handleCloseNotes}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: 'none',
          borderRadius: '10px',
          boxShadow: 24,
          p: 4,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ color: 'black', marginLeft: '10px', marginTop: '8px', fontWeight: '600', fontSize: 'larger' }}>
                {currentTopicTitle}
              </div>
              <div style={{display:'flex'}}>
              <div style={{
                alignSelf: 'end', padding: '10px', fontWeight: '600', color: 'black',
                marginRight: '10px', borderWidth: '2px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                cursor: 'pointer', borderRadius: '5px'
              }} onClick={handleSaveNotes}>Save</div>
              <div style={{
                alignSelf: 'end', padding: '10px', fontWeight: '600', color: 'black',
                marginRight: '10px', borderWidth: '2px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                cursor: 'pointer', borderRadius: '5px'
              }} onClick={handleCloseNotes}>Close</div>
              </div>
            </div>
            <div>
              <Editor
                editorState={noteContent}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setNoteContent}
              />
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar
          open={openLoginAlert}
          autoHideDuration={3000}
          onClose={handleCloseLoginAlert}
          message="You need to Log In first."
        />
    </div>
  );
};

export default Topics;
