import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Leaderboard from './pages/leaderboard/Leaderboard';
import ProjectDetail from './pages/projects/Project-info';
import ProjectAssignmentsPage from './pages/projects/assignments/ProjectAssignments';
import IdeasList from './pages/ideabank/AllIdeasPage';
import IdeaSubmissionForm from './pages/ideabank/CreateNewIdea';
import UserActivityStatus from './pages/debug/ActivityPage';
import EditAssignment from './pages/assignment/edit/EditAssignmentPage';
import Navbar from './utilities/Navbar-main';
import NavbarLogin from './utilities/Navbar-login';
import NavbarRegister from './utilities/Navbar-register';

// Lazy loading components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const UploadAssignment = lazy(() => import('./pages/assignment/create/create-assignment'));
const AssignmentPage = lazy(() => import('./pages/assignment/AllAssignemtsPage'));
const AssignmentSubmissionPage = lazy(() => import('./pages/assignment/submit/SubmitAssignment'));
const AssignmentBasePage = lazy(() => import('./pages/assignment/assignment-reviewee/Assignment-basepage'));
const ReviewSubmissionPage = lazy(() => import('./pages/assignment/review/ReviewAssignmentPage'));
const UserProfilesPage = lazy(() => import('./pages/user_profiles/usersHomepage'));
const EditProfilePage = lazy(() => import('./pages/user_profiles/editProfile'));
const CreateSubtask = lazy(() => import('./pages/assignment/subtasks/Create-subtasks'));
const ChatPage = lazy(() => import('./pages/chats/ChatPage'));
const CreateProject = lazy(() => import('./pages/projects/Create-project'));
const UserProjects = lazy(() => import('./pages/projects/Users-projects'));
const GroupChatPage = lazy(() => import('./pages/groupchat/GroupPage'));
const AddUsersPage = lazy(() => import('./pages/groupchat/AddUserspage'));
const CookiesPage = lazy(() => import('./pages/debug/CookiePage'));
const UserDetailsPage = lazy(() => import('./pages/auth/UserDetailsSetupPage'));
const CookieExample = lazy(() => import('./pages/debug/SampleCookiepage'));
const LoadingPage = lazy(() => import('./functions/handleLoginWithChanneli'));
const UserDetailPage = lazy(() => import('./pages/user_profiles/UserProfile'));
const CreateTag = lazy(() => import('./pages/tags/AddTag'));
const TagList = lazy(() => import('./pages/tags/AllTags'));

// Navbar component that selects the correct navbar based on the route
function NavbarSelector() {
  const location = useLocation();
  
  // Define paths for which the specific navbars are required
  const loginPaths = ['/loginpage', '/loginpage/:enrollmentNo'];
  const registerPaths = ['/registerpage'];

  // Determine which navbar to render based on the current path
  if (loginPaths.some(path => location.pathname.startsWith(path))) {
    return <NavbarLogin />;
  } else if (registerPaths.some(path => location.pathname.startsWith(path))) {
    return <NavbarRegister />;
  } else {
    return <Navbar />;
  }
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavbarSelector /> {/* Render the appropriate navbar */}

      <Routes>
        <Route path="/cookies" element={<CookiesPage />} />

        {/* Auth */}
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/loginpage/:enrollmentNo" element={<UserDetailsPage />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/loading" element={<LoadingPage />} />

        {/* Assignments */}
        <Route path="/:enrollmentNo/:userEnrollmentNo" element={<ChatPage />} />
        <Route path="assignments/:unique_name" element={<AssignmentBasePage />} />
        <Route path="assignments/:unique_name/new-subtask" element={<CreateSubtask />} />
        <Route path="assignments/:unique_name/edit-assignment" element={<EditAssignment />} />
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/assignments/new" element={<UploadAssignment />} />
        <Route path="/submit-assignment/:unique_name" element={<AssignmentSubmissionPage />} />
        <Route path="/submission/review/:unique_submission_name" element={<ReviewSubmissionPage />} />
        
        {/* User Profiles */}
        <Route path="/user-profiles" element={<UserProfilesPage />} />
        <Route path="/user-profiles/:enrollmentNo" element={<UserDetailPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/samplecookie" element={<CookieExample />} />
        
        {/* Tags */}
        <Route path="tags/create-tags" element={<CreateTag />} />
        <Route path="tags/" element={<TagList />} />

        {/* Projects */}
        <Route path="/new-project" element={<CreateProject />} />
        <Route path="/projects" element={<UserProjects />} />
        <Route path="projects/project-chat/:enrollmentNo/:room" element={<GroupChatPage />} />
        <Route path="projects/project-chat/:enrollmentNo/:room/add-users" element={<AddUsersPage />} />
        <Route path="projects/project-info/:roomname" element={<ProjectDetail/>} />
        <Route path="projects/assignments/:roomname" element={<ProjectAssignmentsPage/>} />
       
        {/* Debugging */}
        <Route path="/user-activity" element={<UserActivityStatus/>} />
        
        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard/>} />
        
        {/* Ideas */}
        <Route path="/ideas" element={<IdeasList/>} />
        <Route path="/ideas/create-new-idea" element={<IdeaSubmissionForm/>} />

        {/* Debug */}
        <Route path="/activity" element={<UserActivityStatus/>} />
      </Routes>
    </Suspense>
  );
}

export default App;
