import React, { useEffect, useRef, useState } from 'react';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import { usePutComment, usePostComment } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useCommentHook';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';

export const ReviewModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [comment, setCommment] = useState(new Comment());

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      if (props.comment != undefined) {
         setCommment(props.comment);
      }

   }, [props.comment]);

   const changeRate = (rate: number) => {
      if (comment.id == 0) {
         errorAlert.pleaseWait(isUnmounted);
         usePostComment({ ...comment, rate: rate }).then(result => {
            if (isUnmounted.current) return;
            setCommment(result.data);
            errorAlert.clear();
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      }
      else {
         setCommment({ ...comment, rate: rate });
      }
   };
   const updateDescription = () => {
      if (comment.rate == 0) {
         errorAlert.setSingleError("rate", "Rating is required");
         return;
      }
      errorAlert.pleaseWait(isUnmounted);
      usePutComment(comment).then(result => {
         if (isUnmounted.current) return;
         setCommment(result.data);
         errorAlert.clear();
         props.onClose();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });

   };


   return (
      <Modal className="col-11 col-sm-10 col-lg-5 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader children="Review" />

         <div className="col-12  mt-1 pb-3">
            <div className="col-12 row">
               <div className="mt-auto mb-auto" children="How much do you like this product? Rate it!" />
               <StarRating className="ml-1" onRateChanged={rate => changeRate(rate)} rate={comment.rate != 0 ? comment.rate : undefined} />
            </div>

            <TextArea className="col-12 p-0" label="Review :" rows={4} value={comment.description}
               onChange={(e) => setCommment({ ...comment, description: e.target.value })} />

            <Alert className="col-12" alert={errorAlert.alert} />
            {/***** buttons ****/}
            <ModalFooter
               onUpdate={updateDescription}
               upatedText="Submit"
               onCancel={() => { errorAlert.clear(); props.onClose(); }}
            />
         </div >
      </Modal >
   );
};

declare type IProps = {
   comment: Comment;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
