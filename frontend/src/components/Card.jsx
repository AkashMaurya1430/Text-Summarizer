import { useRef } from "react";

const Card = ({ index, sentence,  type, highlightedIndex, onHover,scrollToCard}) => {

    const isHighlighted = (type === 'summary' && highlightedIndex === index);

    const cardRef = useRef(null);

  if (isHighlighted) {
    scrollToCard(cardRef);
  }

  return (
    <div ref={cardRef} className={`" p-3 rounded-lg mb-5 shadow-xl card cursor-pointer ${
        isHighlighted 
          ? 'border-2 border-blue-500 transition-all duration-300'  
          : 'border-2 border-transparent'
      }`} 
    onMouseEnter={() => onHover(index, type)} 
    onMouseLeave={() => onHover(null, null)}
    >

      <p key={index}>{sentence}</p>
    </div>
  );
};

export default Card;
