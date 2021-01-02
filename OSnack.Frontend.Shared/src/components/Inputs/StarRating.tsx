import React from 'react';

export const StarRating = (props: IProps) => {

   return (
      <div className="rate">
         <input type="radio" id="star5" name="rate" disabled onChange={() => props.onRateChanged(5)} />
         <label htmlFor="star5" title="5 stars" />
         <input type="radio" id="star4" name="rate" disabled checked onChange={() => props.onRateChanged(4)} />
         <label htmlFor="star4" title="4 stars" />
         <input type="radio" id="star3" name="rate" disabled onChange={() => props.onRateChanged(3)} />
         <label htmlFor="star3" title="3 stars" />
         <input type="radio" id="star2" name="rate" disabled onChange={() => props.onRateChanged(2)} />
         <label htmlFor="star2" title="2 stars" />
         <input type="radio" id="star1" name="rate" disabled onChange={() => props.onRateChanged(1)} />
         <label htmlFor="star1" title="1 stars" />
      </div>
   );
};

declare type IProps = {
   onRateChanged: (rate: number) => void;

};
