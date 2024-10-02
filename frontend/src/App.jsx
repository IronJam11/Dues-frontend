import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import LoginPage2 from './pages/auth/LoginPage2';
import RegisterPage from './pages/auth/RegisterPage';
// import SendEmailPage from './pages/EmailPage';
import UploadAssignment from './pages/assignment/create-assignment';
// import ProfileImageUpload from './pages/pre-existing/ImagePage';
// import CreateRoomPage from './pages/GroupchatPage';
// import GroupChatPage from './pages/pre-existing/GroupPage';
// import Groups from './pages/Groups';
import AssignmentPage from './pages/assignment/AllAssignemtsPage';
import UserProfilesPage from './pages/user_profiles/usersHomepage';
import UpdateUserDetails from './pages/user_profiles/editProfile';
import EditProfilePage from './pages/user_profiles/editProfile';
import CreateSubtask from './pages/assignment/subtasks/Create-subtasks';
import AssignmentBasePage from './pages/assignment/Assignment-basepage';
import ChatPage from './pages/chats/ChatPage';
import AssignmentSubmissionPage from './pages/assignment/submit-assignment/SubmitAssignment';
import AssignmentBaseReviewPage from './pages/assignment/assignment-basepage-reviewer';
import CreateProject from './pages/projects/Create-project';
import UserProjects from './pages/projects/Users-projects';
import GroupChatPage from './pages/groupchat/GroupPage';
import AddUsersPage from './pages/groupchat/AddUserspage';
import CookiesPage from './pages/debug/CookiePage';

function App() {
  return (
    <Routes>
      <Route path="/cookies" element={<CookiesPage/>} />

      {/* auth  */}
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/loginpage/:enrollmentNo" element = {<LoginPage2 />} />
      <Route path="/registerpage" element={<RegisterPage />} />

      {/* assignment */}
      <Route path="/:enrollmentNo/:userEnrollmentNo" element={<ChatPage />} />
      <Route path="/assignments" element = {<AssignmentPage/>} />
      <Route path="/createAssignment" element = {<UploadAssignment/>} />
      <Route path="assignments/:unique_name/new-subtask" element = {<CreateSubtask/>} />
      <Route path="assignments/:unique_name" element = {<AssignmentBasePage/>} />
      <Route path="reviewer/:unique_name" element = {<AssignmentBaseReviewPage/>} />
      <Route path="/submit-assignment/:unique_name" element = {<AssignmentSubmissionPage/>} />
      
      {/* about the user  */}
      <Route path="/user-profiles" element = {<UserProfilesPage/>} />
      <Route path="/edit-profile" element = {<EditProfilePage/>} />
      <Route path="/homepage" element={<HomePage />} />
      
      {/* projects */}
      <Route path="/new-project" element = {<CreateProject/>} />
      <Route path="/projects" element = {<UserProjects/>} />
      <Route path="projects/project-chat/:enrollmentNo/:room" element = {<GroupChatPage/>} />
      <Route path="projects/project-chat/:enrollmentNo/:room/add-users" element = {<AddUsersPage/>} />

    </Routes>
  );
}

export default App;
// add email functionality 
