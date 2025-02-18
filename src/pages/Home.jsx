import gym from "../assets/gym.webp";
import LastTwoWeeksCalendar from "../components/CalendarDates";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { ca } from "date-fns/locale";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import YearlyCalendar from "../components/YearCalendar";
import YearOverview from "./YearOverview";

function Home() {
  // * home navigation
  const navigate = useNavigate();
  const handleToday = () => {
    navigate("/today");
  };
  const YearCalendar = () => {
    navigate("/yearoverview");
  }
  const selectedDateWorkout = (date) => {
    // * Convert date string into parts
    const [year, month, day] = date.split("-").map(Number);

    // * Create a new date in LOCAL TIME
    const selectedDate = new Date(year, month - 1, day); // JS months are 0-based

    // * Format as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split("T")[0];

    console.log("Selected Date:", formattedDate);
    navigate(`/selectedworkout?date=${formattedDate}`);
  };

  const [login, setLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // * checks for authentication
  const [authChecked, setAuthChecked] = useState(false);

  // * Prevent scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  // * Check if user is logged in to show modal
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalOpen(true);
      }
      setAuthChecked(true);
    };

    setTimeout(checkAuth, 100);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  // * login logic

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3004/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();
      console.log(data);
      const token = data.token;
      setLogin(true);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", token);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // * register logic
  const [clickRegister, setClickRegister] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (newEmail === "" || newPassword === "" || newName === "") {
      alert("Please fill in all fields");
      return;
    }

    // * Sanitize Inputs to prevent scripting
    const sanitizedEmail = DOMPurify.sanitize(newEmail);
    const sanitizedPassword = DOMPurify.sanitize(newPassword);
    const sanitizedName = DOMPurify.sanitize(newName);

    try {
      const response = await fetch("http://localhost:3004/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          name: sanitizedName,
        }),
      });

      const data = await response.json();
      console.log(data);
      const token = data.token;
      setLogin(true);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", token);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // * logout

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLogin(false);
    window.location.reload();
  };

  // * loading screen while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
      {/* // *div for title and calendar button */}
      <div className="title w-full flex justify-between items-center mt-8">
        <h1 className="text-5xl lg:text-7xl font-bold text-[#87DAF0] text-center flex-1">
          Fitness
        </h1>
        <div className="cal-button mr-6  sm:mr-8 md:mr-10 lg:mr-12 xl:mr-14 2xl:mr-16">
          <button className="w-10 h-10 sm:w-12 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#5492DA] rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-600 transition-all duration-200"
          onClick={YearCalendar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-8 lg:h-8"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
          </button>
        </div>
      </div>
      {/* // * div for image */}
      <div className="home-img mt-8">
        <img src={gym} alt="GYM" className="w-full h-auto object-cover" />
      </div>
      {/* // * div for workout title */}
      <div className="workout-title w-full text-center mt-8">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#6B9BD2] underline decoration-solid">
          Welcome to Today's Workout
        </h1>
      </div>
      {/* // * div for begin workout button */}
      <div className="begin-workout-button mt-8 mb-6 flex justify-center">
        <button
          className="bg-gray-500 text-white py-2 px-10 sm:py-3 sm:px-12 md:py-4 md:px-16 lg:py-5 lg:px-20 text-sm sm:text-base md:text-lg lg:text-xl rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition-all duration-200"
          onClick={handleToday}
        >
          Begin Workout
        </button>
      </div>

      {/* // * grid for previous 2 weeks calendar */}
      <div className="past-workouts-cal mt-8">
        <div className="cal-background bg-[#D0CECE] flex items-center justify-center">
          <div className="m-4 h-[200px] w-[300px] sm:h-[300px] sm:w-[400px] md:h-[350px] md:w-[500px] md:p-6 lg:h-[400px] lg:w-[600px] lg:pt-4 lg:pb-2 flex flex-wrap justify-center items-start gap-4 p-4">
            <LastTwoWeeksCalendar onDateClick={selectedDateWorkout} />
          </div>
        </div>
      </div>

      {/* // * div for handling account button */}
      <div className="account-button flex justify-center mt-8 mb-6">
        <button
          className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#5492DA] rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-600 transition-all duration-200"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
          </svg>
        </button>
      </div>

      {/* // * Modal for login/register */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
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
          {/* // * title for modal */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#87DAF0] font-bold mb-6 text-center">
            {clickRegister ? "Create a Profile" : "Welcome to Fitness"}
          </h2>

          {/* // * Text for modal */}
          <p className="text-lg md:text-xl lg:text-2xl mt-8 mb-6 text-center leading-relaxed">
            {clickRegister
              ? "Fill in your details to create an account:"
              : "To gain access to and start tracking workouts, please login:"}
          </p>

          {/* // * Input Fields */}
          <div className="space-y-6 mt-10 flex flex-col items-center w-full">
            <form
              onSubmit={clickRegister ? handleRegister : handleLogin}
              className="w-full flex flex-col items-center space-y-6"
            >
              {/* // * Name Input (only for Register mode) */}
              {clickRegister && (
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-4 rounded-lg shadow-md bg-[#EDEDED] border border-gray-600 
                   text-lg md:text-xl text-center text-black focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={(e) => setNewName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-4 rounded-lg shadow-md bg-[#EDEDED] border border-gray-600 
                   text-lg md:text-xl text-center text-black focus:outline-none focus:ring focus:ring-blue-300"
                onChange={(e) =>
                  clickRegister
                    ? setNewEmail(e.target.value)
                    : setEmail(e.target.value)
                }
              />
              <input
                type="password"
                placeholder="Your password"
                className="w-full p-4 rounded-lg shadow-md bg-[#EDEDED] border border-gray-600 
                   text-lg md:text-xl text-center text-black focus:outline-none focus:ring focus:ring-blue-300"
                onChange={(e) =>
                  clickRegister
                    ? setNewPassword(e.target.value)
                    : setPassword(e.target.value)
                }
              />
              {/* // * Password Length Requirement only for Register mode */}
              {clickRegister && (
                <p className="text-sm sm:text-base md:text-lg text-gray-700 flex items-center gap-2 whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5 text-red-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2m-.93 4.587a.5.5 0 0 1 .928 0l.39 1.16a.5.5 0 0 0 .47.342h1.221a.5.5 0 0 1 .29.92l-.98.704a.5.5 0 0 0-.18.562l.39 1.16a.5.5 0 0 1-.764.55L8 10.897l-.98.704a.5.5 0 0 1-.764-.55l.39-1.16a.5.5 0 0 0-.18-.562l-.98-.704a.5.5 0 0 1 .29-.92h1.22a.5.5 0 0 0 .47-.342l.39-1.16z" />
                  </svg>
                  Password must be at least{" "}
                  <span className="font-bold text-gray-900">8 characters</span>{" "}
                  long
                </p>
              )}
              {/* // * submit button */}
              <button className="login-btn w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#5492DA] rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-600 transition-all duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                </svg>
              </button>
            </form>
          </div>

          {/* // * Register Text & Close Button */}
          <div className="flex flex-col items-center mt-10 space-y-4">
            <div className="register flex justify-center w-full">
              <p
                className="underline text-[#5492DA] text-lg md:text-xl cursor-pointer 
                      hover:text-blue-700 transition-colors duration-200 whitespace-nowrap"
                onClick={() => setClickRegister(!clickRegister)}
              >
                {clickRegister
                  ? "Already have an account? Login"
                  : "Click here to Register"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
