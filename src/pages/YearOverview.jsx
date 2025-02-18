import YearlyCalendar from "../components/YearCalendar";
import { useNavigate } from "react-router-dom";

function YearOverview() {
    const navigate = useNavigate();
    // * navigate to the home page
    const goHome = () => {
      navigate("/");
    };
  return (
    <>
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Year Overview</h1>
      <YearlyCalendar />
    </div>
    </>
  );
}

export default YearOverview;