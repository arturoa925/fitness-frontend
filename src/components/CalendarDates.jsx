import { format, subDays, isToday } from "date-fns";
import { useEffect, useState } from "react";
import BASE_URL from "./Config";

function LastTwoWeeksCalendar({ onDateClick }) {
  // * Get the last 12 days including today
  const today = new Date();
  const lastTwoWeeks = Array.from({ length: 12 }, (_, i) => {
    const adjustedDate = subDays(today, i);
    return format(adjustedDate, "yyyy-MM-dd");
  });

  const [workouts, setWorkouts] = useState([]);
  const [workoutDates, setWorkoutDates] = useState([]);

  // * fetch all workouts for a user
  const fetchAllWorkouts = async (e) => {
    try {
      const user = localStorage.getItem("user");
      const id = JSON.parse(user).user.id;

      const response = await fetch(`${BASE_URL}/exercise/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      });

      const data = await response.json();
      console.log(data);
      setWorkouts(data);

      const dates = data.exercises.map((workout) => workout.workoutDate);
      setWorkoutDates(dates);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllWorkouts();
  }, []);

  const hasWorkout = (date) => {
    return workoutDates.includes(date);
  };

  // * create a grid of buttons for each day
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
      {lastTwoWeeks.map((date, index) => {
        const formattedDate = format(new Date(date), "yyyy-MM-dd"); // Ensure format consistency
        const isWorkoutDay = hasWorkout(formattedDate); // Check if workout exists

        return (
          <button
            key={index}
            onClick={() => onDateClick(format(new Date(date), "yyyy-MM-dd"))}
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 
            rounded-full hover:bg-gray-300 text-center shadow-md flex items-center justify-center 
            transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-lg 
            ${
              isWorkoutDay
                ? "bg-[#8CBFDF] text-[#6B9BD2"
                : "bg-gray-200 text-[#6B9BD2]"
            }`}
          >
            {format(new Date(date + "T00:00:00Z"), "d")}
          </button>
        );
      })}
    </div>
  );
}

export default LastTwoWeeksCalendar;
