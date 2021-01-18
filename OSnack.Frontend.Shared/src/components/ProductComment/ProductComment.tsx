import React from 'react';
import { Comment } from '../../_core/apiModels';
import { Button } from '../Buttons/Button';
import { StarRating } from '../Inputs/StarRating';

const ProductComment = (props: IProps) => {
   return (
      <div className="row col-12 mx-0 bg-white comment">
         <div className="col small-text text-gray">{props.comment.name}</div>
         <StarRating className="col-auto" rate={props.comment.rate} readonly />
         <div className="col-12">{props.comment.description}</div>
         {props.comment.reply &&
            <div className="col-11 reply ml-auto">
               <div className="col small-text text-gray" children="Customer Support" />
               <div className="col">{props.comment.reply}</div>
            </div>
         }
         {props.reply &&
            <Button className="btn-sm btn-blue ml-auto" onClick={() => props.reply!(props.comment)}
               children={`${props.comment.reply ? "Edit Reply" : "Reply"}`} />
         }
      </div>
   );
};

declare type IProps = {
   comment: Comment;
   reply?: (comment: Comment) => void;
};
export default ProductComment;
