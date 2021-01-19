import React, { useEffect, useRef, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAddReplyComment } from '../../SecretHooks/useCommentHook';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import ProductComment from 'osnack-frontend-shared/src/components/ProductComment/ProductComment';

const ReplyCommentModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [comment, setComment] = useState(new Comment());

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => { setComment(props.comment); }, [props.comment]);

   const addReply = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useAddReplyComment(comment).then(result => {
         if (isUnmounted.current) return;
         setComment(result.data);
         errorAlert.clear();
         props.onClose();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };

   return (
      <Modal className="col-12 col-sm-10 col-lg-6  px-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Reply" />
         <ProductComment comment={comment} />
         <TextArea rows={4} className="mt-2"
            value={comment.reply}
            onChange={i => setComment({ ...comment, reply: i.target.value })}
            label="Reply Message" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => errorAlert.clear()} />
         <ModalFooter
            createText="Reply"
            onCreate={addReply}
            enableLoadingCreate={isUnmounted}
            onCancel={() => { errorAlert.clear(); props.onClose(); }}
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
export default ReplyCommentModal;
