import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar-main';

const IdeasList = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Store user's vote status for each idea
  const [userDetails, setUserDetails] = useState();
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
        try{
            const response = await axios.get('http://127.0.0.1:8000/users/user-data/',
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`
                    }
                }
            )
            setUserDetails(response.data);
            console.log("response",response.data);
        } catch(error)
        {
            console.error("Error:- ", error);
        }

    }

    const initializeData = async () => {
      await fetchIdeas(); 
      await fetchUserDetails();// Fetch initial ideas
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

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading ideas...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div>
        <div className="container mx-auto p-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">All Ideas</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('create-new-idea')}
          >
            Propose an Idea
          </button>
        </div>

        <div className="container mx-auto p-8">
          {ideas.length === 0 ? (
            <div className="text-center mt-10 text-xl font-semibold text-gray-500">
              No ideas, bhai!
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.unique_name} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold">{idea.title}</h2>
                <p className="mt-2">{idea.description}</p>
                <p className="mt-2 text-gray-600">
                  <strong>Votes:</strong> {idea.for_votes} for / {idea.against_votes} against
                </p>

                {/* Voting buttons */}
                <div className="mt-4">
                  <button
                    className={`${
                      userVotes[idea.unique_name] === 'for'
                        ? 'bg-green-700'
                        : 'bg-green-500 hover:bg-green-700'
                    } text-white font-bold py-2 px-4 rounded mr-2`}
                    onClick={() => handleVote(idea.unique_name, 'for')}
                  >
                    Vote For
                  </button>
                  <button
                    className={`${
                      userVotes[idea.unique_name] === 'against'
                        ? 'bg-red-700'
                        : 'bg-red-500 hover:bg-red-700'
                    } text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleVote(idea.unique_name, 'against')}
                  >
                    Vote Against
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default IdeasList;
