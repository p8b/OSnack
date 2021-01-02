import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import React, { useState } from 'react';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';

export const AddComment = (props: IProps) => {
   const [description, setDescription] = useState("");
   const [rate, setRate] = useState(5);

   return (
      <div className="row">
         <StarRating onRateChanged={setRate} />
         <TextArea className="col-12" label="Description"
            value={description}
            onChange={i => setDescription(i.target.value)}
            rows={4}
         />
         <Button children="Send" className="col-auto btn-blue ml-auto mt-1 mr-3"
            onClick={() => { props.onSend(description, rate); setDescription(""); setRate(0); }} />
      </div>
   );
};

declare type IProps = {
   onSend: (description: string, rate: number) => void;
};
