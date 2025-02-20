import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { se } from "date-fns/locale";
import { set } from "date-fns";

function Today() {
  const [workout, setWorkout] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const navigate = useNavigate();
  // * navigate to the home page
  const goHome = () => {
    navigate("/");
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // * generate workout for today on page load
  const todaysWorkout = async (e) => {
    try {
      // * Get today's date in ISO format (e.g., "2022-02-03")
      const today = new Date().toISOString().split("T")[0];
      const user = localStorage.getItem("user");
      const id = JSON.parse(user).user.id;

      const response = await fetch(
        `${API_BASE_URL}/exercise/dailyworkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workoutDate: today,
            user_id: id,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      setWorkout(data.workout);

      const photoMap = {};
      const videoMap = {};
      data.workout.Exercises.forEach((exercise) => {
        if (exercise.photo) {
          photoMap[exercise.id] = exercise.photo;
        }
      });
  
      setPhotos(photoMap);

      data.workout.Exercises.forEach((exercise) => {
        if (exercise.video) {
          videoMap[exercise.id] = exercise.video;
        }
      }
      );

      setVideos(videoMap);

      
      

      // * Format the date to display day of the week (e.g., "Monday 2/3")
      const dateObj = new Date();
      const options = { weekday: "long", month: "numeric", day: "numeric" };
      setFormattedDate(dateObj.toLocaleDateString("en-US", options));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    todaysWorkout();
  }, []);

  // * Handle clicking an exercise card
  const openExerciseModal = (exercise) => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  const closeExerciseModal = () => {
    setSelectedExercise(null);
    setModalOpen(false);
  };

  // * Prevent scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  // // * fetch exercise photos from Pexels api

  // const fetchExercisePhotos = async (exerciseName) => {
  //   try {
  //     const searchQueries = [
  //       `${exerciseName} workout`,
  //       `${exerciseName} exercise`,
  //       `fitness training`,
  //       `general workout`,
  //     ];

  //     for (const query of searchQueries) {
  //       const response = await fetch(
  //         `http://localhost:3004/exercise/pexels?q=${encodeURIComponent(query)}`
  //       );

  //       const data = await response.json();
  //       if (data.photos && data.photos.length > 0) {
  //         return data.photos[0].src.medium; // Return the first found image
  //       }
  //     }

  //     console.warn(
  //       `No images found for "${exerciseName}". Returning placeholder.`
  //     );
  //     return "";
  //   } catch (error) {
  //     console.error("Error fetching images:", error);
  //     return "";
  //   }
  // };

  // const [exerciseImages, setExerciseImages] = useState({});

  // useEffect(() => {
  //   const loadImages = async () => {
  //     if (!workout || !workout.Exercises || workout.Exercises.length === 0) {
  //       console.warn("No exercises available, skipping image fetch.");
  //       return;
  //     }

  //     const imagePromises = workout.Exercises.map(async (exercise) => {
  //       const imageUrl = await fetchExercisePhotos(exercise.name);
  //       return { id: exercise.id, imageUrl };
  //     });

  //     try {
  //       const imageResults = await Promise.all(imagePromises);
  //       const imagesMap = imageResults.reduce((acc, { id, imageUrl }) => {
  //         acc[id] = imageUrl;
  //         return acc;
  //       }, {});

  //       setExerciseImages(imagesMap);
  //     } catch (error) {
  //       console.error("Error loading images:", error);
  //     }
  //   };

  //   loadImages();
  // }, [workout]);

  // // * fetch exercise videos from Pexels api

  // const fetchExerciseVideos = async (exerciseName) => {
  //   try {
  //     const searchQueries = [
  //       `${exerciseName} workout`,
  //       `${exerciseName} exercise`,
  //       `fitness training`,
  //       `general workout`,
  //     ];

  //     for (const query of searchQueries) {
  //       const response = await fetch(
  //         `http://localhost:3004/exercise/pexels?q=${encodeURIComponent(query)}`
  //       );

  //       const data = await response.json();
  //       if (data.videos && data.videos.length > 0) {
  //         return data.videos[0].video_files[0].link;
  //       }
  //     }

  //     console.warn(
  //       `No videos found for "${exerciseName}". Returning placeholder.`
  //     );
  //     return "";
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //     return "";
  //   }
  // };

  // const [exerciseVideos, setExerciseVideos] = useState({});

  // useEffect(() => {
  //   const loadVideos = async () => {
  //     if (!workout || !workout.Exercises || workout.Exercises.length === 0) {
  //       console.warn("No exercises available, skipping video fetch.");
  //       return;
  //     }

  //     const videoPromises = workout.Exercises.map(async (exercise) => {
  //       const videoUrl = await fetchExerciseVideos(exercise.name);
  //       return { id: exercise.id, videoUrl };
  //     });

  //     try {
  //       const videoResults = await Promise.all(videoPromises);
  //       const videosMap = videoResults.reduce((acc, { id, videoUrl }) => {
  //         acc[id] = videoUrl;
  //         return acc;
  //       }, {});

  //       setExerciseVideos(videosMap);
  //     } catch (error) {
  //       console.error("Error loading videos:", error);
  //     }
  //   };

  //   loadVideos();
  // }, [workout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* // * back to home button */}
      <button className="home absolute top-4 left-4" onClick={goHome}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#5492DA]"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
      </button>

      {/*// * Display formatted date */}
      <h1 className="text-2xl text-[#5492DA] font-bold mb-4">
        {formattedDate}
      </h1>

      {/* // * Check if workout exists */}
      {workout && workout?.Exercises?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full max-w-4xl">
          {/* // * create a card for each exercise */}
          {workout.Exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => openExerciseModal(exercise)}
              className="bg-[#D9D9D9] shadow-md rounded-lg p-4 flex flex-row justify-between items-center"
            >
              {/* // * Exercise Name - Left Side */}
              <h2 className="text-lg text-white font-bold">{exercise.name}</h2>

              {/* // * Exercise Image - Middle */}
              <div className="w-1/3">
                {photos && photos[exercise.id] ?(
                  <img
                    src={photos[exercise.id]}
                    alt={exercise.name}
                    className="w-full h-35 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-300 flex items-center justify-center rounded-lg">
                    <p className="text-white">No Image</p>
                  </div>
                )}
              </div>

              {/* // * Exercise Details - Right Side */}
              <div className="mt-2 text-sm text-white">
                {exercise.sets !== null && (
                  <p>
                    <strong>Sets:</strong> {exercise.sets}
                  </p>
                )}
                {exercise.reps !== null && (
                  <p>
                    <strong>Reps:</strong> {exercise.reps}
                  </p>
                )}
                {exercise.duration !== null && (
                  <p>
                    <strong>Duration:</strong> {exercise.duration} sec
                  </p>
                )}
                {exercise.weight !== null && (
                  <p>
                    <strong>Weight:</strong> {exercise.weight} lbs
                  </p>
                )}
                {exercise.distance !== null && (
                  <p>
                    <strong>Distance:</strong> {exercise.distance} m
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 mt-8">No workout found for today.</p>
      )}

      {/* // * Exercise Modal */}
      {modalOpen && selectedExercise && (
        <Modal isOpen={modalOpen} onClose={closeExerciseModal}>
          {/* // * Overlay Background */}
          <div className="fixed inset-0 bg-opacity-50 z-40"></div>

          {/* // * Modal Content */}
          <div
            className="relative z-50  p-8 rounded-lg 
        w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 xl:w-11/12
        mx-auto text-gray-100 transform scale-95 
        transition-transform duration-300 ease-in-out 
        min-h-[60vh] max-h-[85vh] overflow-hidden"
          >
            {/* // * Exercise Name */}
            <h2 className="text-3xl font-bold text-center text-wwhite mb-8">
              {selectedExercise.name}
            </h2>

            {/* // * Exercise Video - Show if Available */}
            <div className="w-full bg-black rounded-lg flex items-center justify-center mb-4">
              {videos && videos[selectedExercise.id] ? (
                <video
                  controls
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                  src={videos[selectedExercise.id]}
                />
              ) : (
                <p className="text-white">No Video Available</p>
              )}
            </div>

            {/* // * Exercise Description */}
            <p className="text-white text-xl text-center mt-8">
              {selectedExercise.description}
            </p>

            {/* // * Close Button */}
            <button
              onClick={closeExerciseModal}
              className="mt-8 bg-[#5492DA] text-white text-lg px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Today;
