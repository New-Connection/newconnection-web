import ProgressBar from "components/ProgressBar/ProgressBar";

const ProporsalCard = () => {
    return (
        <div className="gap-10">
            <ProgressBar bgColor={1} percentage={33} />
            <ProgressBar bgColor={2} percentage={45} />
            <ProgressBar bgColor={3} percentage={88} />
        </div>
    );
};

export default ProporsalCard;
