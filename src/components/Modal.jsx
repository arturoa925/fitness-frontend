// * Modal Component used across all pages

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* // * Semi-transparent Gray Backdrop */}
      <div className="fixed inset-0 bg-gray-300 bg-opacity-40 backdrop-blur-md z-40"></div>

      {/* // * Transparent Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative bg-[#A4A4A4] bg-opacity-40 p-8 rounded-lg shadow-xl 
                       w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 xl:w-1/3
                       text-gray-900 transform scale-95 
                       transition-transform duration-300 ease-in-out 
                       min-h-[50vh] max-h-[90vh] overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
