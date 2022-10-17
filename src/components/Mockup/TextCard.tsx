export const MockupTextCard = ({ label, text }) => {
    return (
        <div className="text-center my-32">
            <div className="font-semibold">{label}</div>
            <p className="text-base-content/50">{text}</p>
        </div>
    );
};
