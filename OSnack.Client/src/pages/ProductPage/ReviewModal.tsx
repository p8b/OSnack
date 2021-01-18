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
   const updateDescription = (loadingCallBack?: () => void) => {
      if (comment.rate == 0) {
         errorAlert.setSingleError("rate", "Rating is required");
         loadingCallBack!();
         return;
      }
      errorAlert.pleaseWait(isUnmounted);
      usePutComment(comment).then(result => {
         if (isUnmounted.current) return;
         setCommment(result.data);
         errorAlert.clear();
         loadingCallBack!();
         props.onClose();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };


   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader children="Review" />
         <div className="col-12 mb-2" children="How much do you like this product? Rate it!" />
         <StarRating className="col-12" onRateChanged={rate => changeRate(rate)} rate={comment.rate != 0 ? comment.rate : undefined} />

         <TextArea className="col-12 p-0" label="Review :" rows={4} value={comment.description}
            onChange={(e) => setCommment({ ...comment, description: e.target.value })} />

         <Alert className="col-12" alert={errorAlert.alert} />
         {/***** buttons ****/}
         <ModalFooter
            updateText="Submit"
            onUpdate={updateDescription}
            onCancel={() => { errorAlert.clear(); props.onClose(); }}
            enableLoadingUpdate={isUnmounted}
         />
      </Modal >
   );
};

declare type IProps = {
   comment: Comment;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
