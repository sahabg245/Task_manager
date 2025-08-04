

type Elements = {
  label: string;
  onClick: () => void;
};

const Keys = ({ label, onClick }: Elements) => {
  return (
    <button
      onClick={onClick}
      className="font-bold flex justify-center hover:bg-gray-600 duration-300 border rounded-xl p-2 bg-gray-400"
    >
      {label}
    </button>
  );
};

export default Keys;
