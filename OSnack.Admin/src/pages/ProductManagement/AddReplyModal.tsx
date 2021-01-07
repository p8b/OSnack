import React, { useEffect, useRef, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAddReplyComment } from '../../SecretHooks/useCommentHook';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';

const AddReplyModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [comment, setComment] = useState(new Comment());

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => {
      setComment(props.comment);
   }, [props.comment]);

   const addReply = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useAddReplyComment(comment).then((result) => {
         if (isUnmounted.current) return;
         setComment(result.data);
         props.onClose();
      }
      ).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });;
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-6 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Reply" />
            <div className=" mt-1">
               <div className="col-12 pm-0">
                  <div key={props.comment.id} className="comment">
                     <div className="row">
                        <div className="col-6 small-text text-gray">{comment.name}</div>
                        <div className="col-6">
                           <StarRating className="float-right" rate={comment.rate} readonly />
                        </div>
                     </div>
                     <div className="col-12">{props.comment.description}</div>
                  </div>
                  <TextArea rows={4} value={comment.reply} onChange={i => setComment({ ...comment, reply: i.target.value })} label="Reply Message" />
               </div>
               {/***** buttons ****/}
               <div className="col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Alert alert={errorAlert.alert}
                     className="col-12 mb-2"
                     onClosed={() => { errorAlert.clear(); }}
                  />
                  <ModalFooter
                     upatedText="Send Reply"
                     onUpdate={addReply}
                     onCancel={() => { errorAlert.clear(); props.onClose(); }}
                  />
               </div>
            </div>
         </>
      </Modal >

   );

};

declare type IProps = {
   comment: Comment;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
export default AddReplyModal;
