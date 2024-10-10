import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UploadAssignment from './pages/assignment/create-assignment';
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
import UserDetailsPage from './pages/auth/UserDetailsSetupPage';
import ReviewSubmissionPage from './pages/assignment/review/ReviewAssignmentPage';
import CookieExample from './pages/debug/SampleCookiepage';
import  LoadingPage  from './functions/handleLoginWithChanneli';

function App() {
  return (
    <Routes>
      <Route path="/cookies" element={<CookiesPage/>} />

      {/* auth  */}
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/loginpage/:enrollmentNo" element = {<UserDetailsPage />} />
      <Route path="/registerpage" element={<RegisterPage />} />
      <Route path="/loading" element={<LoadingPage/>} />

      {/* assignment */}
      <Route path="/:enrollmentNo/:userEnrollmentNo" element={<ChatPage />} />
      <Route path="/assignments" element = {<AssignmentPage/>} />
      <Route path="/createAssignment" element = {<UploadAssignment/>} />
      <Route path="assignments/:unique_name/new-subtask" element = {<CreateSubtask/>} />
      <Route path="assignments/:unique_name" element = {<AssignmentBasePage/>} />
      <Route path="reviewer/:unique_name" element = {<AssignmentBaseReviewPage/>} />
      <Route path="/submit-assignment/:unique_name" element = {<AssignmentSubmissionPage/>} />
      <Route path="/submission/review/:unique_submission_name" element = {<ReviewSubmissionPage/>} />
      
      
      {/* about the user  */}
      <Route path="/user-profiles" element = {<UserProfilesPage/>} />
      <Route path="/edit-profile" element = {<EditProfilePage/>} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/samplecookie" element = {<CookieExample/>} />

      
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
