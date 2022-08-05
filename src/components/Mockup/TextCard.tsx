export const MockupTextCard = ({ label, text }) => {
    return (
        <div className="text-center my-32">
            <div className="font-semibold">{label}</div>
            <p className="text-gray-400">{text}</p>
        </div>
    );
};
