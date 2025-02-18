import { format, startOfYear, addDays, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useEffect, useState } from "react";

function YearlyCalendar({ onDateClick }) {
  const today = new Date();
  const startOfCurrentYear = startOfYear(today);

  // * Generate all months of the current year
  const months = eachMonthOfInterval({
    start: startOfCurrentYear,
    end: new Date(today.getFullYear(), 11, 31), // End of the year
  });

  const [workoutDates, setWorkoutDates] = useState([]);

  // * Fetch all workouts for the user
  const fetchAllWorkouts = async () => {
    try {
      const user = localStorage.getItem("user");
      const id = JSON.parse(user).user.id;

      const response = await fetch("http://localhost:3004/exercise/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      });

      const data = await response.json();
      console.log(data);

      // Extract only workout dates for easier lookup
      const dates = data.exercises.map((workout) => workout.workoutDate);
      setWorkoutDates(dates);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllWorkouts();
  }, []);

  const hasWorkout = (date) => workoutDates.includes(date);

  return (
    <>
    
    <div className="p-4 space-y-6">
      {months.map((monthStart, monthIndex) => {
        const monthDays = eachDayOfInterval({
          start: startOfMonth(monthStart),
          end: endOfMonth(monthStart),
        });

        return (
          <div key={monthIndex} className="border-b pb-4">
            {/* Month Label */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {format(monthStart, "MMMM yyyy")}
            </h2>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((date, dayIndex) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const isWorkoutDay = hasWorkout(formattedDate);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => onDateClick(formattedDate)}
                    className={`w-10 h-10 rounded-md shadow-md flex items-center justify-center text-sm font-medium
                    transition-all duration-200 ${
                      isWorkoutDay
                        ? "bg-[#8CBFDF] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {format(date, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}

export default YearlyCalendar;