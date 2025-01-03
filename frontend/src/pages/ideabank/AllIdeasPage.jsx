import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar-main';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Modal from 'react-modal'; // Import Modal for popups
import { Link } from 'react-router-dom'; 

import { registerables } from 'chart.js';

Chart.register(...registerables);
Chart.register(CategoryScale);

Modal.setAppElement('#root'); // Required for accessibility when using modals

const IdeasList = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Store user's vote status for each idea
  const [userDetails, setUserDetails] = useState();
  const [selectedIdea, setSelectedIdea] = useState(null); // To store the selected idea for modal
  const websocketRef = useRef(null); // WebSocket reference
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial ideas data
    const fetchIdeas = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/ideas/all-ideas/', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        const ideasData = response.data.ideas;
        console.log(response.data.ideas);
        setIdeas(ideasData);  // Set ideas initially
      } catch (err) {
        setError('Failed to fetch ideas');
      } finally {
        setLoading(false);
      }
    };

    // Fetch user votes for all ideas
    const fetchUserVotes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/ideas/user-voting-details/', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
          }
        });

        const votesData = response.data.ideas; // 'ideas' contains unique_name mapped to the vote type
        setUserVotes(votesData); // Store user votes
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/user-data/', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
          }
        });
        setUserDetails(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error:- ", error);
      }
    };

    const initializeData = async () => {
      await fetchIdeas();
      await fetchUserDetails(); // Fetch initial ideas
      await fetchUserVotes(); // Fetch user votes after fetching ideas
    };

    initializeData();

    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${protocol}://${window.location.hostname}:8000/ws/ideas/`;
    websocketRef.current = new WebSocket(socketUrl);

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'vote_update') {
        // Update the idea that has the matching unique_name with the new vote counts
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) => {
            if (idea.unique_name === data.unique_name) {
              return {
                ...idea,
                for_votes: data.for_votes,
                against_votes: data.against_votes,
              };
            }
            return idea;
          })
        );
      }
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleVote = (unique_name, voteType) => {
    const previousVote = userVotes[unique_name]; // Get the user's previous vote for this idea

    const message = JSON.stringify({
      type: 'vote',
      unique_name: unique_name,
      vote: voteType,
      enrollmentNo: userDetails.enrollmentNo,
    });

    websocketRef.current.send(message);

    // Update vote counts optimistically on the frontend
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.unique_name === unique_name) {
          let updatedForVotes = idea.for_votes;
          let updatedAgainstVotes = idea.against_votes;

          // Adjust counts based on previous vote and new vote
          if (previousVote === 'for' && voteType === 'against') {
            updatedForVotes -= 1; // Decrement the 'for' votes
            updatedAgainstVotes += 1; // Increment the 'against' votes
          } else if (previousVote === 'against' && voteType === 'for') {
            updatedForVotes += 1; // Increment the 'for' votes
            updatedAgainstVotes -= 1; // Decrement the 'against' votes
          } else if (!previousVote) {
            // New vote
            if (voteType === 'for') {
              updatedForVotes += 1; // Increment the 'for' votes
            } else if (voteType === 'against') {
              updatedAgainstVotes += 1; // Increment the 'against' votes
            }
          }

          return {
            ...idea,
            for_votes: updatedForVotes,
            against_votes: updatedAgainstVotes,
          };
        }
        return idea;
      })
    );

    // Record the user's vote
    setUserVotes((prevVotes) => ({
      ...prevVotes,
      [unique_name]: voteType,
    }));
  };

  const openIdeaModal = (idea) => {
    setSelectedIdea(idea);
  };

  const closeIdeaModal = () => {
    setSelectedIdea(null);
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading ideas...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <div>
        <div className="container mx-auto p-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">All Ideas</h1>
        </div>
  
        <div className="container mx-auto p-8">
          {ideas.length === 0 ? (
            <div className="text-center mt-10 text-xl font-semibold text-gray-500">
              No ideas, bhai!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ideas.map((idea) => (
                <div key={idea.unique_name} className="bg-white shadow-md rounded-lg p-4 mb-4">
                  
                  <h1 className="text-3xl font-bold truncate">{idea.title}</h1>
                  <h3 className="text-3l font-bold mb-4">Workspace: "{idea.workspace}"</h3>
                  <p className="mt-2 text-sm text-gray-600 truncate">{idea.description}</p>
  
                  {/* Bar plot for votes */}
                  <div className="mt-4">
                    <Bar
                      data={{
                        labels: ['For', 'Against'],
                        datasets: [{
                          label: 'Votes',
                          data: [idea.for_votes, idea.against_votes],
                          backgroundColor: [
                            'rgba(0, 255, 0, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                          ],
                          borderColor: [
                            'rgba(0, 255, 0, 1)',
                            'rgba(255, 0, 0, 1)',
                          ],
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        scales: {
                          yAxes: [{
                            ticks: {
                              beginAtZero: true
                            }
                          }]
                        }
                      }}
                    />
                  </div>
  
                  {/* Voting buttons */}
                  <div className="mt-4">
                    <button
                      className={`${
                        userVotes[idea.unique_name] === 'for'
                          ? 'bg-green-700'
                          : 'bg-green-500 hover:bg-green-700'
                      } text-white font-bold py-1 px-3 rounded mr-2`}
                      onClick={() => handleVote(idea.unique_name, 'for')}
                    >
                      Vote For
                    </button>
                    <button
                      className={`${
                        userVotes[idea.unique_name] === 'against'
                          ? 'bg-red-700'
                          : 'bg-red-500 hover:bg-red-700'
                      } text-white font-bold py-1 px-3 rounded`}
                      onClick={() => handleVote(idea.unique_name, 'against')}
                    >
                      Vote Against
                    </button>
                  </div>
  
                  {/* View Details Button */}
                  <button
                    className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() => openIdeaModal(idea)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Modal for viewing details */}
        {selectedIdea && (
        <Modal
        isOpen={!!selectedIdea}
        onRequestClose={closeIdeaModal}
        contentLabel="Idea Details"
        ariaHideApp={true}
        className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      >
        <h2 className="text-2xl font-bold">{selectedIdea.title}</h2>
        <p className="mt-4">{selectedIdea.description}</p>
      
        {/* Mapping through the users */}
        {selectedIdea.users && selectedIdea.users.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-3xl font-bold mb-4">Workspace:- {selectedIdea.workspace}</h3>
            <h3 className="text-lg font-semibold">Users involved:</h3>
            <ul className="list-disc list-inside mt-2">
              {selectedIdea.users.map((user, index) => (
                <li key={index} className="text-gray-700">
                  <Link
                    to={`/user-profiles/${user.enrollmentNo}/`}
                    className="text-blue-500 hover:underline"
                  >
                    {user.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No users associated with this idea.</p>
        )}
      
        <button
          className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded"
          onClick={closeIdeaModal}
        >
          Close
        </button>
      </Modal>
      
      
      )}
      </div>
    </>
  );
  
};

export default IdeasList;
