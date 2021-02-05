import React, { useEffect, useRef, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ProductComment from 'osnack-frontend-shared/src/components/ProductComment/ProductComment';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllComment } from '../../SecretHooks/useCommentHook';
import ReplyCommentModal from './ReplyCommentModal';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import { useTableData } from 'osnack-frontend-shared/src/components/Table/Table';

const CommentModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);
   const [commentList, setCommentList] = useState<Comment[]>([]);
   const [isOpenReplyModal, setIsOpenReplyModal] = useState(false);
   const [selectedComment, setSelectedComment] = useState(new Comment());

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => { reload(); }, [props.productId]);

   const reload = (selectedPage = tbl.selectedPage, maxItemsPerPage = tbl.maxItemsPerPage) => {
      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (maxItemsPerPage != tbl.maxItemsPerPage)
         tbl.setMaxItemsPerPage(maxItemsPerPage);



      errorAlert.pleaseWait(isUnmounted);
      useAllComment(props.productId, selectedPage, maxItemsPerPage).then(result => {
         if (isUnmounted.current) return;
         setCommentList(result.data.commentList!);
         tbl.setTotalItemCount(result.data.totalCount!);
         errorAlert.clear();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };

   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6 pm-0 px-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Comments" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         {commentList!.map(comment =>
            <ProductComment key={comment.id} comment={comment}
               reply={comment => {
                  setSelectedComment(comment);
                  setIsOpenReplyModal(true);
               }} />
         )}
         <div className="col-12 pm-0 mb-2 pos-b-sticky bg-white">
            <Pagination
               maxItemsPerPage={tbl.maxItemsPerPage}
               selectedPage={tbl.selectedPage}
               listCount={tbl.totalItemCount}
               onChange={(selectedPage, maxItemsPerPage) => { reload(selectedPage, maxItemsPerPage); }}
            />
            <Button children="Close"
               className="col-12 mt-3 btn-white btn-lg"
               onClick={() => { errorAlert.clear(); props.onClose(); }} />
         </div>

         <ReplyCommentModal isOpen={isOpenReplyModal} comment={selectedComment}
            onClose={() => { setSelectedComment(new Comment()); setIsOpenReplyModal(false); reload(); }} />
      </Modal >
   );
};

declare type IProps = {
   productId: number;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
export default CommentModal;
